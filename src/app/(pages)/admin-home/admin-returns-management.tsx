'use client'

import {useState, useEffect} from 'react'
import {Button} from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {DoorClosed, Building, GraduationCap, CheckCircle, User, Package, Calendar} from 'lucide-react'
import {toast} from 'sonner'

interface ReservedRoom {
    id: number;
    room_number: string;
    building: string;
    faculty: string;
    start_date: string;
    end_date: string;
    reserved_by: string;
}

interface ReservedItem {
    id: number;
    item_id: string;
    student_id: string;
    start_date: string;
    end_date: string;
    name: string;
}

interface ConfirmDialogState {
    isOpen: boolean;
    type: 'room' | 'item';
    data: ReservedRoom | ReservedItem | null;
}

export function AdminReturnsManagement() {
    const [reservedRooms, setReservedRooms] = useState<ReservedRoom[]>([])
    const [reservedItems, setReservedItems] = useState<ReservedItem[]>([])
    const [loading, setLoading] = useState(true)
    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
        isOpen: false,
        type: 'room',
        data: null
    })

    useEffect(() => {
        fetchReservedRoomsAndItems()
    }, [])

    const fetchReservedRoomsAndItems = async () => {
        setLoading(true);
        try {
            const [roomsResponse, itemsResponse] = await Promise.all([
                fetch(`http://localhost:8000/admin_paths/get_reserved_rooms`),
                fetch(`http://localhost:8000/admin_paths/get_reserved_items`)
            ]);

            if (!roomsResponse.ok || !itemsResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const roomsData = await roomsResponse.json();
            const itemsData = await itemsResponse.json();

            if (!Array.isArray(itemsData.reserved_items)) {
                throw new Error('Items data is not an array');
            }

            const updatedItems = itemsData.reserved_items.map((item: any) => ({
                id: item.id,
                item_id: item.item_id,
                student_id: item.student_id,
                start_date: item.start_date,
                end_date: item.end_date,
                name: item.name
            }));

            setReservedRooms(roomsData.rooms);
            setReservedItems(updatedItems);
            toast.success('Data loaded successfully');
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRoomReturn = async (room: ReservedRoom) => {
        setConfirmDialog({isOpen: true, type: 'room', data: room});
    }

    const handleItemReturn = async (item: ReservedItem) => {
        setConfirmDialog({isOpen: true, type: 'item', data: item});
    }

    const handleConfirmReturn = async () => {
        if (!confirmDialog.data) return;

        try {
            let response;
            if (confirmDialog.type === 'room') {
                const room = confirmDialog.data as ReservedRoom;
                response = await fetch(`http://localhost:8000/admin_paths/return_room`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        room_number: room.room_number,
                        reserved_by: room.reserved_by,
                        faculty: room.faculty,
                        building: room.building
                    }),
                });
            } else {
                const item = confirmDialog.data as ReservedItem;
                response = await fetch(`http://localhost:8000/admin_paths/return_item`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: item.item_id,
                        reserved_by: item.student_id
                    }),
                });
            }

            const data = await response.json();

            if (response.ok) {
                await fetchReservedRoomsAndItems();
                toast.success(data.message);
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('Error returning item:', error);
            toast.error(`Failed to return ${confirmDialog.type}. Please try again.`);
        } finally {
            setConfirmDialog({isOpen: false, type: 'room', data: null});
        }
    }

    if (loading) {
        return <div className="container mx-auto py-10">Ładowanie...</div>
    }

    return (
        <div className="container mx-auto py-10">
            <div className="grid grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Zarezerwowane Pokoje</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Numer Pokoju</TableHead>
                                <TableHead>Budynek</TableHead>
                                <TableHead>Wydział</TableHead>
                                <TableHead>Data Rezerwacji</TableHead>
                                <TableHead>Zarezerwowane Przez</TableHead>
                                <TableHead className="text-right">Akcje</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reservedRooms.map((room) => (
                                <TableRow key={room.id}>
                                    <TableCell>
                                        <span className="flex items-center gap-2">
                                            <DoorClosed className="h-4 w-4"/>
                                            {room.room_number}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="flex items-center gap-2">
                                            <Building className="h-4 w-4"/>
                                            {room.building}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="flex items-center gap-2">
                                            <GraduationCap className="h-4 w-4"/>
                                            {room.faculty}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4"/>
                                            {new Date(room.start_date).toLocaleDateString()} - {new Date(room.end_date).toLocaleDateString()}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="flex items-center gap-2">
                                            <User className="h-4 w-4"/>
                                            {room.reserved_by}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            onClick={() => handleRoomReturn(room)}
                                            className="gap-2">
                                            <CheckCircle className="h-4 w-4"/>
                                            Potwierdź Zwrot
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4">Zarezerwowane Przedmioty</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nazwa przedmiotu</TableHead>
                                <TableHead>Login studenta</TableHead>
                                <TableHead>Zakres rezerwacji</TableHead>
                                <TableHead className="text-right">Akcje</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reservedItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <span className="flex items-center gap-2">
                                            <Package className="h-4 w-4"/>
                                            {item.name}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="flex items-center gap-2">
                                            <User className="h-4 w-4"/>
                                            {item.student_id}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4"/>
                                            {new Date(item.start_date).toLocaleDateString()} - {new Date(item.end_date).toLocaleDateString()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button onClick={() => handleItemReturn(item)}
                                                className="gap-2">
                                            <CheckCircle className="h-4 w-4"/>
                                            Potwierdź Zwrot
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={confirmDialog.isOpen}
                    onOpenChange={(isOpen) => !isOpen && setConfirmDialog({isOpen: false, type: 'room', data: null})}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Potwierdź
                            odbiór {confirmDialog.type === 'room' ? 'pokoju' : 'przedmiotu'}</DialogTitle>
                    </DialogHeader>
                    <p>Czy na pewno chcesz potwierdzić
                        odbiór {confirmDialog.type === 'room' ? 'pokoju' : 'przedmiotu'}?</p>
                    {confirmDialog.type === 'room' && confirmDialog.data && (
                        <p>Pokój: {(confirmDialog.data as ReservedRoom).room_number}</p>
                    )}
                    {confirmDialog.type === 'item' && confirmDialog.data && (
                        <p>Przedmiot: {(confirmDialog.data as ReservedItem).name}</p>
                    )}
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setConfirmDialog({
                            isOpen: false,
                            type: 'room',
                            data: null
                        })}>Anuluj</Button>
                        <Button variant="default" onClick={handleConfirmReturn}>Potwierdź</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}


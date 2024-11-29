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


export function AdminReturnsManagement() {
    const [reservedRooms, setReservedRooms] = useState<ReservedRoom[]>([])
    const [reservedItems, setReservedItems] = useState<ReservedItem[]>([])
    const [loading, setLoading] = useState(true)

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
            console.log(itemsData)

            const updatedItems = itemsData.reserved_items.map((item: any) => ({
                id: item.id,
                item_id: item.item_id,
                student_id: item.student_id,
                start_date: item.start_date,
                end_date: item.end_date,
                name: item.name
            }));

            console.log(updatedItems)

            setReservedRooms(roomsData.rooms);
            setReservedItems(updatedItems);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const handleRoomReturn = async (room_number: string, reservedBy: string, faculty: string, building: string) => {
        try {
            const response = await fetch(`http://localhost:8000/admin_paths/return_room`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    room_number: room_number,
                    reserved_by: reservedBy,
                    faculty: faculty,
                    building: building
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to return room')
            }

            toast.success('Room returned successfully')
            fetchReservedRoomsAndItems()
        } catch (error) {
            console.error('Error returning room:', error)
            toast.error('Failed to return room. Please try again.')
        }
    }

    const handleItemReturn = async (itemId: string, reservedBy: string) => {
        try {

            const data = {
                id: itemId,
                reserved_by: reservedBy
            }

            const jsonString = JSON.stringify(data)
            console.log(jsonString)

            const response = await fetch(`http://localhost:8000/admin_paths/return_item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: jsonString,
            })

            if (!response.ok) {
                throw new Error('Failed to return item')
            }

            toast.success('Item returned successfully')
            fetchReservedRoomsAndItems()
        } catch (error) {
            console.error('Error returning item:', error)
            toast.error('Failed to return item. Please try again.')
        }
    }

    if (loading) {
        return <div className="container mx-auto py-10">Loading...</div>
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
                                            onClick={() => handleRoomReturn(room.room_number, room.reserved_by, room.faculty, room.building)}
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
                                        <Button onClick={() => handleItemReturn(item.item_id, item.student_id)}
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
        </div>
    )
}

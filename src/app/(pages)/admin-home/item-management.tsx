'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building, DoorClosed, GraduationCap, Package, Plus, Trash2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface Item {
    id: number;
    name: string;
    amount: number;
    room_id: number;
    room_number: string;
    building_number: string;
    building: string;
    faculty: string;
    type: string;
    attribute: string;
}

interface Type {
    id: number;
    type_name: string;
}

interface Attribute {
    id: number;
    attribute_name: string;
}

interface Faculty {
    id: number,
    name: string,
    admin_id: number
}

interface Building {
    id: number,
    name: string,
    faculty: string,
}

interface Room {
    id: number,
    number: number,
    type: boolean
}

export function ItemManagement() {
    const [items, setItems] = useState<Item[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [types, setTypes] = useState<Type[]>([])
    const [attributes, setAttributes] = useState<Attribute[]>([])
    const [faculties, setFaculties] = useState<Faculty[]>([])
    const [buildings, setBuildings] = useState<Building[]>([])
    const [rooms, setRooms] = useState<Room[]>([])
    const [isLoading, setIsLoading] = useState({ faculties: false, buildings: false })
    const [newItem, setNewItem] = useState({
        name: '',
        amount: 0,
        room_id: 0,
        room_number: '',
        building_number: '',
        type: '',
        attribute: '',
        faculty: '',
        building: '',
    })
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, itemId: null as number | null });

    useEffect(() => {
        fetchItems()
        fetchTypes()
        fetchAttributes()
        fetchFaculties()
    }, [])

    const fetchItems = async () => {
        try {
            const response = await fetch(`http://localhost:8000/admin_paths/get_all_items`)
            if (!response.ok) {
                throw new Error('Failed to fetch items')
            }
            const data = await response.json()

            const updatedItems = data.items.map((item: any) => ({
                id: item.id,
                name: item.name,
                amount: item.amount,
                type: item.type,
                room_number: item.room_number,
                attribute: item.attribute,
                user: item.user,
                building: item.building,
                faculty: item.faculty
            }))

            setItems(updatedItems)
        } catch (error) {
            console.error('Error fetching items:', error)
        }
    }

    const fetchFaculties = async () => {
        setIsLoading(prev => ({ ...prev, faculties: true }))
        try {
            const response = await fetch(`http://localhost:8000/admin_paths/get_all_faculty`)
            const data = await response.json()
            if (response.ok) {
                setFaculties(data.faculties)
                toast.success('Faculties fetched successfully')
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            console.error('Error fetching faculties:', error)
            toast.error('Failed to fetch faculties')
        } finally {
            setIsLoading(prev => ({ ...prev, faculties: false }))
        }
    }

    const fetchBuildings = async (facultyName: string) => {
        setIsLoading(prev => ({ ...prev, buildings: true }))
        try {
            console.log("Faculty Name: ", facultyName)
            const response = await fetch(`http://localhost:8000/admin_paths/get_buildings_by_faculty/${facultyName}`)
            const data = await response.json()
            if (response.ok) {
                setBuildings(data.buildings)
                toast.success('Buildings fetched successfully')
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            console.error('Error fetching buildings:', error)
            toast.error('Failed to fetch buildings')
        } finally {
            setIsLoading(prev => ({ ...prev, buildings: false }))
        }
    }

    const fetchRooms = async (buildingName: string) => {
        try {
            const response = await fetch(`http://localhost:8000/admin_paths/get_rooms_by_building/${buildingName}`)
            const data = await response.json()
            if (response.ok) {
                // Filtrowanie tylko pokoi, które mają type: false
                const availableRooms = data.rooms.filter((room: Room) => room.type === false)
                setRooms(availableRooms) // Ustawienie dostępnych pokoi
                toast.success('Rooms fetched successfully')
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            console.error('Error fetching rooms:', error)
            toast.error('Failed to fetch rooms')
        }
    }
    
    

    const fetchTypes = async () => {
        try {
            const response = await fetch(`http://localhost:8000/admin_paths/types`)
            const data = await response.json()
            if (response.ok) {
                setTypes(data.types)
                toast.success('Types fetched successfully')
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            console.error('Error fetching types:', error)
        }
    }

    const fetchAttributes = async () => {
        try {
            const response = await fetch(`http://localhost:8000/admin_paths/attributes`)

            const data = await response.json()
            if (response.ok) {
                setAttributes(data.attributes)
                toast.success('Attributes fetched successfully')
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            console.error('Error fetching attributes:', error)
        }
    }

    const handleBuildingChange = (buildingName: string) => {
        setNewItem(prev => ({ ...prev, building: buildingName, building_number: buildingName }))
        fetchRooms(buildingName)  // Fetch rooms after selecting building
    }

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validateItem(newItem)) {
            try {
                const body = JSON.stringify({
                    name: newItem.name,
                    amount: newItem.amount,
                    room_with_items: newItem.room_number,
                    type: newItem.type,
                    attribute: newItem.attribute,
                    faculty: newItem.faculty,
                    building: newItem.building_number,
                })

                const response = await fetch(`http://localhost:8000/admin_paths/add_item`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: body,
                })

                const data = await response.json()

                if (response.ok) {
                    await fetchItems()
                    setNewItem({
                        name: '', amount: 0, room_id: 0, room_number: '', building_number: '',
                        type: '', attribute: '', faculty: '', building: ''
                    })
                    setIsDialogOpen(false)
                    toast.success(data.message)

                } else {
                    toast.error(data.error)
                }

            } catch (error) {
                console.error('Error adding item:', error)
                alert('Failed to add item. Please try again.')
            }
        } else {
            alert('Please fill all fields correctly.')
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | {
        target: { name: string; value: string }
    }) => {
        const { name, value } = e.target
        setNewItem(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseInt(value) || 0 : value
        }))
    }

    const handleDeleteItem = async (id: number) => {
        setConfirmDialog({ isOpen: true, itemId: id });
    }

    const handleConfirmDelete = async () => {
        if (confirmDialog.itemId === null) return;

        try {
            const response = await fetch(`http://localhost:8000/admin_paths/delete_item/${confirmDialog.itemId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (response.ok) {
                await fetchItems();
                toast.success(data.message);
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error('Failed to delete item. Please try again.');
        } finally {
            setConfirmDialog({ isOpen: false, itemId: null });
        }
    }

    const validateItem = (item: Omit<Item, 'id'>): boolean => {
        return (
            item.name.trim() !== '' &&
            item.amount > 0 &&
            item.room_number.trim() !== '' &&
            item.building_number.trim() !== '' &&
            item.type.trim() !== '' &&
            item.attribute.trim() !== '' &&
            item.faculty.trim() !== ''
        )
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Zarządzanie Przedmiotami</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Dodaj Przedmiot
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Dodaj Nowy Przedmiot</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nazwa Przedmiotu</Label>
                                <Input id="name" name="name" value={newItem.name} onChange={handleInputChange}
                                    required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount">Ilość</Label>
                                <Input id="amount" name="amount" type="number" value={newItem.amount}
                                    onChange={handleInputChange} required min="1" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="building_number">Numer Budynku</Label>
                                <Select 
                                    name="building_number" 
                                    value={newItem.building} 
                                    onValueChange={(buildingName) => {
                                        handleBuildingChange(buildingName);  // Aktualizowanie stanu po wybraniu budynku
                                        fetchRooms(buildingName);  // Wywołanie fetchRooms po wybraniu budynku
                                    }} 
                                    disabled={!newItem.faculty}  // Zablokowanie wyboru budynku, jeśli nie wybrano wydziału
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Wybierz budynek" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {buildings.map((building) => (
                                            <SelectItem key={building.id} value={building.name}>
                                                {building.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                            <Label htmlFor="room_number">Numer Pokoju</Label>
                            <Select
                                name="room_number"
                                value={newItem.room_number}
                                onValueChange={(value) => {
                                    handleInputChange({
                                        target: { name: 'room_number', value }
                                    });
                                }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Wybierz pokój" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rooms.map((room) => (
                                            <SelectItem key={room.id} value={String(room.number)}>
                                                {room.number}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Typ</Label>
                                <Select name="type"
                                    onValueChange={(value) => handleInputChange({ target: { name: 'type', value } })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Wybierz typ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {types.map((type) => (
                                            <SelectItem key={type.id}
                                                value={type.type_name}>{type.type_name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="attribute">Atrybut</Label>
                                <Select name="attribute" onValueChange={(value) => handleInputChange({
                                    target: {
                                        name: 'attribute',
                                        value
                                    }
                                })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Wybierz atrybut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {attributes.map((attr) => (
                                            <SelectItem key={attr.id}
                                                value={attr.attribute_name}>{attr.attribute_name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="faculty">Wydział</Label>
                                <Select name="faculty" value={newItem.faculty} onValueChange={(value) => {
                                    handleInputChange({
                                        target: { name: 'faculty', value }
                                    });
                                    fetchBuildings(value); // Wywołanie funkcji po wybraniu wydziału
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Wybierz wydział" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {faculties.map((faculty) => (
                                            <SelectItem key={faculty.id} value={faculty.name}>
                                                {faculty.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit">Dodaj Przedmiot</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nazwa Przedmiotu</TableHead>
                        <TableHead>Ilość</TableHead>
                        <TableHead>Numer Pokoju</TableHead>
                        <TableHead>Numer Budynku</TableHead>
                        <TableHead>Nazwa Wydziału</TableHead>
                        <TableHead>Typ</TableHead>
                        <TableHead>Atrybut</TableHead>
                        <TableHead className="text-right">Akcje</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <span className="flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    {item.name}
                                </span>
                            </TableCell>
                            <TableCell>{item.amount}</TableCell>
                            <TableCell>
                                <span className="flex items-center gap-2">
                                    <DoorClosed className="h-4 w-4" />
                                    {item.room_number}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="flex items-center gap-2">
                                    <Building className="h-4 w-4" />
                                    {item.building}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4" />
                                    {item.faculty}
                                </span>
                            </TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell>{item.attribute}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="destructive" size="icon" onClick={() => handleDeleteItem(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog open={confirmDialog.isOpen}
                onOpenChange={(isOpen) => !isOpen && setConfirmDialog({ isOpen: false, itemId: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Potwierdź usunięcie</DialogTitle>
                    </DialogHeader>
                    <p>Czy na pewno chcesz usunąć ten przedmiot? Ta operacja jest nieodwracalna.</p>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline"
                            onClick={() => setConfirmDialog({ isOpen: false, itemId: null })}>Anuluj</Button>
                        <Button variant="destructive" onClick={handleConfirmDelete}>Usuń</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

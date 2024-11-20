'use client'

import {useState} from 'react'
import {Button} from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Package, Plus, Trash2, DoorClosed, Building, GraduationCap} from 'lucide-react'

interface Item {
    id: number;
    name: string;
    quantity: number;
    roomNumber: string;
    buildingNumber: string;
    faculty: string;
}

export function ItemManagement() {
    const [items, setItems] = useState<Item[]>([
        {id: 1, name: 'Laptop', quantity: 5, roomNumber: '101', buildingNumber: 'A1', faculty: 'Informatyka'},
        {id: 2, name: 'Projektor', quantity: 2, roomNumber: '202', buildingNumber: 'B2', faculty: 'Matematyka'},
    ])
    const [newItem, setNewItem] = useState<Omit<Item, 'id'>>({
        name: '',
        quantity: 0,
        roomNumber: '',
        buildingNumber: '',
        faculty: '',
    })
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setNewItem(prev => ({...prev, [name]: name === 'quantity' ? parseInt(value) || 0 : value}))
    }

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateItem(newItem)) {
            setItems(prev => [...prev, {...newItem, id: Date.now()}])
            setNewItem({name: '', quantity: 0, roomNumber: '', buildingNumber: '', faculty: ''})
            setIsDialogOpen(false)
        } else {
            alert('Proszę wypełnić wszystkie pola poprawnie.')
        }
    }

    const handleDeleteItem = (id: number) => {
        setItems(prev => prev.filter(item => item.id !== id))
    }

    const validateItem = (item: Omit<Item, 'id'>): boolean => {
        return (
            item.name.trim() !== '' &&
            item.quantity > 0 &&
            item.roomNumber.trim() !== '' &&
            item.buildingNumber.trim() !== '' &&
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
                            <Plus className="h-4 w-4"/>
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
                                       required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Ilość</Label>
                                <Input id="quantity" name="quantity" type="number" value={newItem.quantity}
                                       onChange={handleInputChange} required min="1"/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="roomNumber">Numer Pokoju</Label>
                                <Input id="roomNumber" name="roomNumber" value={newItem.roomNumber}
                                       onChange={handleInputChange} required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="buildingNumber">Numer Budynku</Label>
                                <Input id="buildingNumber" name="buildingNumber" value={newItem.buildingNumber}
                                       onChange={handleInputChange} required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="faculty">Nazwa Wydziału</Label>
                                <Input id="faculty" name="faculty" value={newItem.faculty} onChange={handleInputChange}
                                       required/>
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
                        <TableHead className="text-right">Akcje</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                <span className="flex items-center gap-2">
                  <Package className="h-4 w-4"/>
                    {item.name}
                </span>
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>
                <span className="flex items-center gap-2">
                  <DoorClosed className="h-4 w-4"/>
                    {item.roomNumber}
                </span>
                            </TableCell>
                            <TableCell>
                <span className="flex items-center gap-2">
                  <Building className="h-4 w-4"/>
                    {item.buildingNumber}
                </span>
                            </TableCell>
                            <TableCell>
                <span className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4"/>
                    {item.faculty}
                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="destructive" size="icon" onClick={() => handleDeleteItem(item.id)}>
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
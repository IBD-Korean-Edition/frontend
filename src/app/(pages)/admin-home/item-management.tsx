'use client'

import {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Building, DoorClosed, GraduationCap, Package, Plus, Trash2} from 'lucide-react'

interface Item {
    id: number;
    name: string;
    amount: number;
    room_id: number;
    item_owner: string;
    room_number: string;
    building_number: string; // Added this line
    building: string;
    faculty: string;
}

export function ItemManagement() {
    const [items, setItems] = useState<Item[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newItem, setNewItem] = useState({
        name: '',
        amount: 0,
        room_id: 0,
        room_number: '',
        building_number: '',
        item_owner: '',
    })

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validateItem(newItem)) {
            try {
                const body = JSON.stringify({
                    building_number: newItem.building_number,
                    room_number: newItem.room_number,
                    item_owner: newItem.item_owner,
                    item_name: newItem.name,
                    item_amount: newItem.amount,
                    room_id: newItem.room_id
                })

                console.log(body)
                const response = await fetch(`http://localhost:8000/admin_paths/add_item`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: body,
                })
                if (!response.ok) {
                    throw new Error('Failed to add item')
                }
                await fetchItems()
                setNewItem({name: '', amount: 0, room_id: 0, room_number: '', building_number: '', item_owner: ''})
                setIsDialogOpen(false)
            } catch (error) {
                console.error('Error adding item:', error)
                alert('Failed to add item. Please try again.')
            }
        } else {
            alert('Please fill all fields correctly.')
        }
    }


    useEffect(() => {
        fetchItems()
    }, [])

    const fetchItems = async () => {
        try {
            const response = await fetch(`http://localhost:8000/admin_paths/get_all_items`)
            if (!response.ok) {
                throw new Error('Failed to fetch items')
            }
            const data = await response.json()
            setItems(data.items)
        } catch (error) {
            console.error('Error fetching items:', error)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setNewItem(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseInt(value) || 0 : value
        }))
    }

    const handleDeleteItem = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8000/admin_paths/delete_item/${id}`, {
                method: 'DELETE',
            })
            if (!response.ok) {
                throw new Error('Failed to delete item')
            }
            await fetchItems()
        } catch (error) {
            console.error('Error deleting item:', error)
            alert('Failed to delete item. Please try again.')
        }
    }

    const validateItem = (item: Omit<Item, 'id' | 'building' | 'faculty'>): boolean => {
        return (
            item.name.trim() !== '' &&
            item.amount > 0 &&
            item.room_number.trim() !== '' &&
            item.building_number.trim() !== '' &&
            item.item_owner.trim() !== ''
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
                                <Label htmlFor="amount">Ilość</Label>
                                <Input id="amount" name="amount" type="number" value={newItem.amount}
                                       onChange={handleInputChange} required min="1"/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="building_number">Numer Budynku</Label>
                                <Input id="building_number" name="building_number" value={newItem.building_number}
                                       onChange={handleInputChange} required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="room_number">Numer Pokoju</Label>
                                <Input id="room_number" name="room_number" value={newItem.room_number}
                                       onChange={handleInputChange} required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="item_owner">Właściciel Przedmiotu</Label>
                                <Input id="item_owner" name="item_owner" value={newItem.item_owner}
                                       onChange={handleInputChange} required/>
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
                        <TableHead>Właściciel</TableHead>
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
                            <TableCell>{item.amount}</TableCell>
                            <TableCell>
                                <span className="flex items-center gap-2">
                                    <DoorClosed className="h-4 w-4"/>
                                    {item.room_number}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="flex items-center gap-2">
                                    <Building className="h-4 w-4"/>
                                    {item.building}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4"/>
                                    {item.faculty}
                                </span>
                            </TableCell>
                            <TableCell>{item.item_owner}</TableCell>
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


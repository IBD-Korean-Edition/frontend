'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DoorClosed, Building, GraduationCap, CheckCircle, User, Package } from 'lucide-react'

export function AdminReturnsManagement() {
    const [rooms, setRooms] = useState([
        { id: 1, roomNumber: '101', buildingNumber: 'A1', faculty: 'Informatyka', returned: false },
        { id: 2, roomNumber: '202', buildingNumber: 'B2', faculty: 'Matematyka', returned: false },
        { id: 3, roomNumber: '303', buildingNumber: 'C3', faculty: 'Fizyka', returned: false },
    ])

    const [items, setItems] = useState([
        { id: 1, studentLogin: 'student1', itemName: 'Laptop', returned: false },
        { id: 2, studentLogin: 'student2', itemName: 'Projektor', returned: false },
        { id: 3, studentLogin: 'student3', itemName: 'Kamera', returned: false },
    ])

    const handleRoomReturn = (id: number) => {
        setRooms(rooms.map(room =>
            room.id === id ? { ...room, returned: true } : room
        ))
    }

    const handleItemReturn = (id: number) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, returned: true } : item
        ))
    }

    return (
        <div className="container mx-auto py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-bold mb-4 md:mb-0">Zwroty Pokoi</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Numer Pokoju</TableHead>
                                <TableHead>Numer Budynku</TableHead>
                                <TableHead>Nazwa Wydziału</TableHead>
                                <TableHead className="text-right">Akcje</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rooms.filter(room => !room.returned).map((room) => (
                                <TableRow key={room.id}>
                                    <TableCell>
                                        <span className="flex items-center gap-2">
                                            <DoorClosed className="h-4 w-4" />
                                            {room.roomNumber}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="flex items-center gap-2">
                                            <Building className="h-4 w-4" />
                                            {room.buildingNumber}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="flex items-center gap-2">
                                            <GraduationCap className="h-4 w-4" />
                                            {room.faculty}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button onClick={() => handleRoomReturn(room.id)} className="gap-2">
                                            <CheckCircle className="h-4 w-4" />
                                            Potwierdź Zwrot
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4 md:mb-0">Zwroty Przedmiotów</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Login Studenta</TableHead>
                                <TableHead>Nazwa Przedmiotu</TableHead>
                                <TableHead className="text-right">Akcje</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.filter(item => !item.returned).map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <span className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            {item.studentLogin}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="flex items-center gap-2">
                                            <Package className="h-4 w-4" />
                                            {item.itemName}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button onClick={() => handleItemReturn(item.id)} className="gap-2">
                                            <CheckCircle className="h-4 w-4" />
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
'use client'

import React, { useState } from 'react'
import { format } from 'date-fns'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Building2, CalendarDays, DoorClosed, GraduationCap } from 'lucide-react'
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {toast} from "sonner";

interface Room {
    id: number;
    roomNumber: string;
    buildingNumber: string;
    faculty: string;
}

export function RoomsBookingComponent() {
    const [open, setOpen] = useState(false)
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
    const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [error, setError] = useState('')

    const rooms: Room[] = [
        { id: 1, roomNumber: "101", buildingNumber: "A1", faculty: "Informatyka" },
        { id: 2, roomNumber: "202", buildingNumber: "B2", faculty: "Matematyka" },
        { id: 3, roomNumber: "303", buildingNumber: "C3", faculty: "Fizyka" },
        { id: 4, roomNumber: "404", buildingNumber: "D4", faculty: "Chemia" },
    ]

    const handleReservation = (room: Room) => {
        setSelectedRoom(room)
        setOpen(true)
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === 'from') {
            setStartDate(value)
        } else {
            setEndDate(value)
        }
    }

    const handleSubmitReservation = (e: React.FormEvent) => {
        e.preventDefault()
        const start = new Date(startDate)
        const end = new Date(endDate)
        const now = new Date()

        if (start < now) {
            setError('Data rozpoczęcia nie może być w przeszłości')
            return
        }

        if (end <= start) {
            setError('Data zakończenia musi być późniejsza niż data rozpoczęcia')
            return
        }

        setError('')
        setOpen(false)
        // Here you would typically send the reservation to your backend
        toast('Reservation confirmed');
        console.log(`Rezerwacja pokoju ${selectedRoom?.roomNumber} od ${startDate} do ${endDate}`)
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-4">Zarządzanie pokojami do rezerwacji</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[25%]">Numer Pokoju</TableHead>
                        <TableHead className="w-[25%]">Numer Budynku</TableHead>
                        <TableHead className="w-[25%]">Nazwa Wydziału</TableHead>
                        <TableHead className="w-[25%] text-center">Akcje</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rooms.map((room) => (
                        <TableRow key={room.id}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <DoorClosed className="h-5 w-5"/>
                                    <span>{room.roomNumber}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5"/>
                                    <span>{room.buildingNumber}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5"/>
                                    <span>{room.faculty}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <Button
                                    onClick={() => handleReservation(room)}
                                    className="gap-2"
                                >
                                    <CalendarDays className="h-5 w-5"/>
                                    Rezerwuj
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Rezerwacja pokoju {selectedRoom?.roomNumber}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitReservation} className="grid gap-4 py-4">
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="start-date" className="text-right">
                                    Od
                                </Label>
                                <Input
                                    id="start-date"
                                    type="date"
                                    className="col-span-3"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    min={format(new Date(), 'yyyy-MM-dd')}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="end-date" className="text-right">
                                    Do
                                </Label>
                                <Input
                                    id="end-date"
                                    type="date"
                                    className="col-span-3"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate || format(new Date(), 'yyyy-MM-dd')}
                                    required
                                />
                            </div>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <Button type="submit" className="w-full">
                            Potwierdź rezerwację
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
'use client'

import React, {useState} from 'react'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {BookOpen, Microscope, Zap, FlaskConical, Building2, GraduationCap} from 'lucide-react'
import {format} from 'date-fns'
import {toast} from "sonner";

type Item = {
    id: number
    name: string
    quantity: number
    room: string
    buildingNumber: string
    department: string
    icon: React.ElementType
}

const items: Item[] = [
    {
        id: 1,
        name: "Mikroskop",
        quantity: 10,
        room: "Lab 101",
        buildingNumber: "A1",
        department: "Biologia",
        icon: Microscope
    },
    {id: 2, name: "Oscyloskop", quantity: 5, room: "Lab 202", buildingNumber: "B2", department: "Fizyka", icon: Zap},
    {
        id: 3,
        name: "Pipeta automatyczna",
        quantity: 20,
        room: "Lab 303",
        buildingNumber: "C3",
        department: "Chemia",
        icon: FlaskConical
    },
    {
        id: 4,
        name: "Spektrofotometr",
        quantity: 3,
        room: "Lab 404",
        buildingNumber: "D4",
        department: "Biochemia",
        icon: FlaskConical
    },
    {
        id: 5,
        name: "Kamera termowizyjna",
        quantity: 2,
        room: "Lab 505",
        buildingNumber: "E5",
        department: "Inżynieria",
        icon: Zap
    },
]

export function StudentItemManagementComponent() {
    const [isReservationOpen, setIsReservationOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<Item | null>(null)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [error, setError] = useState('')

    const handleReserve = (item: Item) => {
        setSelectedItem(item)
        setIsReservationOpen(true)
        setStartDate('')
        setEndDate('')
        setError('')
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

        // Here you would typically send the reservation to your backend
        toast('Reservation confirmed');
        console.log(`Rezerwacja dla ${selectedItem?.name} od ${startDate} do ${endDate}`)
        setIsReservationOpen(false)
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-4">Zarządzanie przedmiotami do rezerwacji</h1>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Przedmiot</TableHead>
                            <TableHead>Ilość</TableHead>
                            <TableHead>Pokój</TableHead>
                            <TableHead>Numer budynku</TableHead>
                            <TableHead>Wydział</TableHead>
                            <TableHead>Akcja</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center">
                                        <item.icon className="mr-2 h-4 w-4"/>
                                        {item.name}
                                    </div>
                                </TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.room}</TableCell>
                                <TableCell>
                                    <Building2 className="inline mr-1 h-4 w-4"/>
                                    {item.buildingNumber}
                                </TableCell>
                                <TableCell>
                                    <GraduationCap className="inline mr-1 h-4 w-4"/>
                                    {item.department}
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => handleReserve(item)} size="sm">
                                        <BookOpen className="mr-2 h-4 w-4"/>
                                        Zarezerwuj
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Zarezerwuj {selectedItem?.name}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitReservation}>
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
                        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
                        <DialogFooter>
                            <Button type="submit">Potwierdź rezerwację</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
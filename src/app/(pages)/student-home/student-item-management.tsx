'use client'

import React, {useEffect, useState} from 'react'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {BookOpen, Building2, FlaskConical, GraduationCap, Microscope, Zap} from 'lucide-react'
import {format} from 'date-fns'
import {toast} from "sonner"

type Item = {
    id: number
    name: string
    amount: number
    type: number
    attributes: string
    room_number: string
    building: string
    faculty: string
}

const iconMap: { [key: string]: React.ElementType } = {
    'Mikroskop': Microscope,
    'Oscyloskop': Zap,
    'Pipeta automatyczna': FlaskConical,
    'Spektrofotometr': FlaskConical,
    'Kamera termowizyjna': Zap,
}

export function StudentItemManagementComponent() {
    const [items, setItems] = useState<Item[]>([])
    const [isReservationOpen, setIsReservationOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<Item | null>(null)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        fetchAvailableItems()
    }, [])

    const fetchAvailableItems = async () => {
        try {
            const id = sessionStorage.getItem('student_login')
            const response = await fetch(`http://localhost:8000/student/get_available_items/${id}`)
            if (!response.ok) {
                throw new Error('Failed to fetch available items')
            }
            const data = await response.json()
            console.log(data)
            setItems(data.items)
        } catch (error) {
            console.error('Error fetching available items:', error)
            toast.error('Failed to load available items')
        }
    }

    const handleReserve = (item: Item) => {
        setSelectedItem(item)
        setIsReservationOpen(true)
        setStartDate('')
        setEndDate('')
        setError('')
    }

    const handleSubmitReservation = async (e: React.FormEvent) => {
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

        try {
            const data = {
                student_id: sessionStorage.getItem('student_login'),
                item_id: selectedItem?.id,
                start_date: startDate,
                end_date: endDate,
            };

            const jsonString = JSON.stringify(data);
            console.log(jsonString);

            const response = await fetch(`http://localhost:8000/student/rent_item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: jsonString,
            })

            const responseData = await response.json()

            if (response.ok) {
                setIsReservationOpen(false)
                await fetchAvailableItems()
                toast.success(responseData.message || 'Item rented successfully')
            }else {
                toast.error(responseData.error || 'Failed to rent item')
            }

        } catch (error) {
            console.error('Error renting item:', error)
            toast.error((error as Error).message || 'Failed to rent item')
        }
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
                            <TableHead>Typ</TableHead>
                            <TableHead>Atrybut</TableHead>
                            <TableHead>Akcja</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center">
                                        {React.createElement(iconMap[item.name] || FlaskConical, {className: "mr-2 h-4 w-4"})}
                                        {item.name}
                                    </div>
                                </TableCell>
                                <TableCell>{item.amount}</TableCell>
                                <TableCell>{item.room_number}</TableCell>
                                <TableCell>
                                    <Building2 className="inline mr-1 h-4 w-4"/>
                                    {item.building}
                                </TableCell>
                                <TableCell>
                                    <GraduationCap className="inline mr-1 h-4 w-4"/>
                                    {item.faculty}
                                </TableCell>
                                <TableCell>
                                    <FlaskConical className="inline mr-1 h-4 w-4"/>
                                    {item.type}
                                </TableCell>
                                <TableCell>{item.attributes}</TableCell>
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

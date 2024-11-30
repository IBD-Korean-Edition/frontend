'use client'

import {useEffect, useState} from 'react'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Calendar, Clock, Building, GraduationCap, User, Laptop, Check, X} from 'lucide-react'
import {format} from 'date-fns'

interface Booking {
    id: number
    room_id: number
    room_number: string
    building: string
    faculty: string
    user: string
    start_time: string
    end_time: string
}

interface ItemBooking {
    id: number
    item_id: string
    name: string
    student_id: string
    start_date: string
    end_date: string
    returned: boolean
}

export function BookingsTable() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [itemBookings, setItemBookings] = useState<ItemBooking[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response1 = await fetch('http://localhost:8000/admin_paths/bookings')
                if (!response1.ok) {
                    throw new Error('Failed to fetch bookings')
                }
                const data1 = await response1.json()
                setBookings(data1.bookings)

                const response2 = await fetch('http://localhost:8000/admin_paths/returned_item_bookings')
                if (!response2.ok) {
                    throw new Error('Failed to fetch returned item bookings')
                }
                const data2 = await response2.json()
                setItemBookings(data2.item_bookings)
            } catch (err) {
                setError('An error occurred while fetching bookings')
            } finally {
                setIsLoading(false)
            }
        }

        fetchBookings()
    }, [])

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Loading bookings...</div>
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Zarządzanie rezerwacjami</h1>
            <div className="flex space-x-8">
                <Card className="w-1/2">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Rezerwacja pokoju</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Pokój</TableHead>
                                    <TableHead>Budynek</TableHead>
                                    <TableHead>Wydział</TableHead>
                                    <TableHead>Zarezerwowane przez</TableHead>
                                    <TableHead>Czas rozpoczęcia</TableHead>
                                    <TableHead>Czas zakończenia</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground"/>
                                                <span>{booking.room_number}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Building className="h-4 w-4 text-muted-foreground"/>
                                                <span>{booking.building}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <GraduationCap className="h-4 w-4 text-muted-foreground"/>
                                                <span>{booking.faculty}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <User className="h-4 w-4 text-muted-foreground"/>
                                                <span>{booking.user}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Clock className="h-4 w-4 text-muted-foreground"/>
                                                <span>{format(new Date(booking.start_time), 'dd MMM yyyy HH:mm')}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Clock className="h-4 w-4 text-muted-foreground"/>
                                                <span>{format(new Date(booking.end_time), 'dd MMM yyyy HH:mm')}</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="w-1/2">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Rezerwacja przedmiotu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Przedmiot</TableHead>
                                    <TableHead>Student ID</TableHead>
                                    <TableHead>Data rozpoczęcia</TableHead>
                                    <TableHead>Data zakończenia</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {itemBookings.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center space-x-2">
                                                <Laptop className="h-4 w-4 text-muted-foreground"/>
                                                <span>{booking.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <User className="h-4 w-4 text-muted-foreground"/>
                                                <span>{booking.student_id}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground"/>
                                                <span>{format(new Date(booking.start_date), 'dd MMM yyyy')}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground"/>
                                                <span>{format(new Date(booking.end_date), 'dd MMM yyyy')}</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


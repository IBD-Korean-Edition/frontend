'use client'

import {useEffect, useState} from 'react'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Calendar, Clock, Building, GraduationCap, User} from 'lucide-react'
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

export function BookingsTable() {
    const [bookings, setBookings] = useState<Booking[]>([])
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
                console.log(data1)
                setBookings(data1.bookings)

                const response2 = await fetch('http://localhost:8000/admin_paths/returned_item_bookings')
                if (!response2.ok) {
                    throw new Error('Failed to fetch returned item bookings')
                }
                const data2 = await response2.json()
                console.log(data2)
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
            <h1 className="text-3xl font-bold mb-6">Bookings Management</h1>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">All Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Room</TableHead>
                                <TableHead>Building</TableHead>
                                <TableHead>Faculty</TableHead>
                                <TableHead>Reserved By</TableHead>
                                <TableHead>Start Time</TableHead>
                                <TableHead>End Time</TableHead>
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
        </div>
    )
}

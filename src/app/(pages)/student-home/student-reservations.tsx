'use client'

import React, {useEffect, useState} from 'react'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Building2, DoorOpen, GraduationCap, Microscope} from 'lucide-react'
import {format} from 'date-fns'

type ReservedRoom = {
    id: number
    room_number: string
    building: string
    faculty: string
    start_date: string
    end_date: string
}

type ReservedItem = {
    id: number
    name: string
    room_number: string
    building: string
    faculty: string
    start_date: string
    end_date: string
}

export function StudentReservationsComponent() {
    const [reservedRooms, setReservedRooms] = useState<ReservedRoom[]>([])
    const [reservedItems, setReservedItems] = useState<ReservedItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true)
            try {
                const username = sessionStorage.getItem('student_login');
                const [roomsResponse, itemsResponse] = await Promise.all([
                    fetch(`http://localhost:8000/student/reserved_rooms/${username}`),
                    fetch(`http://localhost:8000/student/reserved_items/${username}`)
                ])

                if (!roomsResponse.ok || !itemsResponse.ok) {
                    throw new Error('Failed to fetch reservations')
                }

                const roomsData = await roomsResponse.json()
                const itemsData = await itemsResponse.json()

                setReservedRooms(roomsData.rooms)
                setReservedItems(itemsData.items)
            } catch (err) {
                setError('Failed to load reservations. Please try again later.')
                console.error('Error fetching reservations:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchReservations()
    }, [])

    if (loading) {
        return <div className="container mx-auto py-10">Loading...</div>
    }

    if (error) {
        return <div className="container mx-auto py-10 text-red-500">{error}</div>
    }

    return (
        <div className="container mx-auto py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold flex items-center">
                            <DoorOpen className="mr-2 h-6 w-6"/>
                            Zarezerwowane pokoje
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Numer pokoju</TableHead>
                                        <TableHead>Numer budynku</TableHead>
                                        <TableHead>Wydział</TableHead>
                                        <TableHead>Data rezerwacji</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reservedRooms.map((room) => (
                                        <TableRow key={room.id}>
                                            <TableCell className="font-medium">{room.room_number}</TableCell>
                                            <TableCell>
                                                <Building2 className="inline mr-1 h-4 w-4"/>
                                                {room.building}
                                            </TableCell>
                                            <TableCell>
                                                <GraduationCap className="inline mr-1 h-4 w-4"/>
                                                {room.faculty}
                                            </TableCell>
                                            <TableCell>
                                                {format(new Date(room.start_date), 'dd.MM.yyyy')} - {format(new Date(room.end_date), 'dd.MM.yyyy')}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold flex items-center">
                            <Microscope className="mr-2 h-6 w-6"/>
                            Zarezerwowane przedmioty
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nazwa przedmiotu</TableHead>
                                        <TableHead>Numer pokoju</TableHead>
                                        <TableHead>Numer budynku</TableHead>
                                        <TableHead>Wydział</TableHead>
                                        <TableHead>Data rezerwacji</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reservedItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.name}</TableCell>
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
                                                {format(new Date(item.start_date), 'dd.MM.yyyy')} - {format(new Date(item.end_date), 'dd.MM.yyyy')}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


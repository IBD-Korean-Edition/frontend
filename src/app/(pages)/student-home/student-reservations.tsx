'use client'

import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, GraduationCap, Microscope, DoorOpen } from 'lucide-react'

type ReservedRoom = {
  id: number
  roomNumber: string
  buildingNumber: string
  department: string
}

type ReservedItem = {
  id: number
  name: string
  roomNumber: string
  buildingNumber: string
  department: string
}

const reservedRooms: ReservedRoom[] = [
  { id: 1, roomNumber: "101", buildingNumber: "A1", department: "Informatyka" },
  { id: 2, roomNumber: "205", buildingNumber: "B2", department: "Fizyka" },
  { id: 3, roomNumber: "310", buildingNumber: "C3", department: "Chemia" },
]

const reservedItems: ReservedItem[] = [
  { id: 1, name: "Mikroskop", roomNumber: "101", buildingNumber: "A1", department: "Biologia" },
  { id: 2, name: "Oscyloskop", roomNumber: "205", buildingNumber: "B2", department: "Fizyka" },
  { id: 3, name: "Pipeta automatyczna", roomNumber: "310", buildingNumber: "C3", department: "Chemia" },
]

export function StudentReservationsComponent() {
  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <DoorOpen className="mr-2 h-6 w-6" />
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservedRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.roomNumber}</TableCell>
                      <TableCell>
                        <Building2 className="inline mr-1 h-4 w-4" />
                        {room.buildingNumber}
                      </TableCell>
                      <TableCell>
                        <GraduationCap className="inline mr-1 h-4 w-4" />
                        {room.department}
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
              <Microscope className="mr-2 h-6 w-6" />
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.roomNumber}</TableCell>
                      <TableCell>
                        <Building2 className="inline mr-1 h-4 w-4" />
                        {item.buildingNumber}
                      </TableCell>
                      <TableCell>
                        <GraduationCap className="inline mr-1 h-4 w-4" />
                        {item.department}
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
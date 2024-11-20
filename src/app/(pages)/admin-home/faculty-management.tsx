'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Building, GraduationCap, DoorClosed } from 'lucide-react'

interface Faculty {
  id: number;
  name: string;
}

interface Building {
  id: number;
  number: string;
  facultyId: number;
}

interface Room {
  id: number;
  number: string;
  buildingId: number;
}

export function FacultyManagement() {
  const [faculties, setFaculties] = useState<Faculty[]>([
    { id: 1, name: 'Informatyka' },
    { id: 2, name: 'Matematyka' },
  ])
  const [buildings, setBuildings] = useState<Building[]>([
    { id: 1, number: 'A1', facultyId: 1 },
    { id: 2, number: 'B1', facultyId: 1 },
    { id: 3, number: 'C1', facultyId: 2 },
  ])
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, number: '101', buildingId: 1 },
    { id: 2, number: '102', buildingId: 1 },
    { id: 3, number: '201', buildingId: 2 },
  ])
  const [selectedFaculty, setSelectedFaculty] = useState<number | null>(null)
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null)
  const [newFaculty, setNewFaculty] = useState('')
  const [newBuilding, setNewBuilding] = useState('')
  const [newRoom, setNewRoom] = useState('')

  const handleAddFaculty = (e: FormEvent) => {
    e.preventDefault()
    setFaculties([...faculties, { id: faculties.length + 1, name: newFaculty }])
    setNewFaculty('')
  }

  const handleAddBuilding = (e: FormEvent) => {
    e.preventDefault()
    if (selectedFaculty !== null) {
      setBuildings([...buildings, { id: buildings.length + 1, number: newBuilding, facultyId: selectedFaculty }])
      setNewBuilding('')
    }
  }

  const handleAddRoom = (e: FormEvent) => {
    e.preventDefault()
    if (selectedBuilding !== null) {
      setRooms([...rooms, { id: rooms.length + 1, number: newRoom, buildingId: selectedBuilding }])
      setNewRoom('')
    }
  }

  const handleRemoveFaculty = (id: number) => {
    setFaculties(faculties.filter(faculty => faculty.id !== id))
    setBuildings(buildings.filter(building => building.facultyId !== id))
    if (selectedFaculty === id) setSelectedFaculty(null)
  }

  const handleRemoveBuilding = (id: number) => {
    setBuildings(buildings.filter(building => building.id !== id))
    setRooms(rooms.filter(room => room.buildingId !== id))
    if (selectedBuilding === id) setSelectedBuilding(null)
  }

  const handleRemoveRoom = (id: number) => {
    setRooms(rooms.filter(room => room.id !== id))
  }

  return (
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Wydziały</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Dodaj Wydział
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dodaj Wydział</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddFaculty} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="faculty-name">Nazwa Wydziału</Label>
                      <Input
                          id="faculty-name"
                          value={newFaculty}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewFaculty(e.target.value)}
                          required
                      />
                    </div>
                    <Button type="submit">Dodaj</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nazwa</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faculties.map((faculty) => (
                    <TableRow key={faculty.id} className={selectedFaculty === faculty.id ? 'bg-muted' : ''}>
                      <TableCell className="font-medium">
                        <Button variant="ghost" className="w-full justify-start gap-2"
                                onClick={() => setSelectedFaculty(faculty.id)}>
                          <GraduationCap className="h-4 w-4" />
                          {faculty.name}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="destructive" size="icon"
                                onClick={() => handleRemoveFaculty(faculty.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Budynki</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2" disabled={!selectedFaculty}>
                    <PlusCircle className="h-4 w-4" />
                    Dodaj Budynek
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dodaj Budynek</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddBuilding} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="building-number">Numer Budynku</Label>
                      <Input
                          id="building-number"
                          value={newBuilding}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewBuilding(e.target.value)}
                          required
                      />
                    </div>
                    <Button type="submit">Dodaj</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numer</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buildings
                    .filter(building => !selectedFaculty || building.facultyId === selectedFaculty)
                    .map((building) => (
                        <TableRow key={building.id}
                                  className={selectedBuilding === building.id ? 'bg-muted' : ''}>
                          <TableCell className="font-medium">
                            <Button variant="ghost" className="w-full justify-start gap-2"
                                    onClick={() => setSelectedBuilding(building.id)}>
                              <Building className="h-4 w-4" />
                              {building.number}
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="destructive" size="icon"
                                    onClick={() => handleRemoveBuilding(building.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Pokoje</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2" disabled={!selectedBuilding}>
                    <PlusCircle className="h-4 w-4" />
                    Dodaj Pokój
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dodaj Pokój</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddRoom} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="room-number">Numer Pokoju</Label>
                      <Input
                          id="room-number"
                          value={newRoom}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewRoom(e.target.value)}
                          required
                      />
                    </div>
                    <Button type="submit">Dodaj</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numer</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms
                    .filter(room => !selectedBuilding || room.buildingId === selectedBuilding)
                    .map((room) => (
                        <TableRow key={room.id}>
                          <TableCell className="font-medium">
                                            <span className="flex items-center gap-2">
                                                <DoorClosed className="h-4 w-4" />
                                              {room.number}
                                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="destructive" size="icon"
                                    onClick={() => handleRemoveRoom(room.id)}>
                              <Trash2 className="h-4 w-4" />
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
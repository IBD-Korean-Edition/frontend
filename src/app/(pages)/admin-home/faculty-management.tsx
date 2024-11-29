'use client'

import {ChangeEvent, FormEvent, useEffect, useState} from 'react'
import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Building, DoorClosed, GraduationCap, PlusCircle, Trash2} from 'lucide-react'

interface Faculty {
    id: number;
    name: string;
}

interface Room {
    id: number;
    room_number: string;
    is_to_rent: boolean;
    building: string;
    faculty: string;
}

interface Building {
    id: number;
    name: string;
    RoomToRent: Room[];
    RoomWithItems: Room[];
}

export function FacultyManagement() {
    const [faculties, setFaculties] = useState<Faculty[]>([])
    const [buildings, setBuildings] = useState<Building[]>([])
    const [rooms, setRooms] = useState<Room[]>([])
    const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null)
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
    const [newFaculty, setNewFaculty] = useState('')
    const [newBuilding, setNewBuilding] = useState('')
    const [newRoom, setNewRoom] = useState('')
    const [isRoomForRent, setIsRoomForRent] = useState(false)
    const [openDialogs, setOpenDialogs] = useState({faculty: false, building: false, room: false});
    const [isLoading, setIsLoading] = useState({faculties: false, buildings: false, rooms: false});


    useEffect(() => {
        setIsLoading({...isLoading, faculties: true})
        fetchFaculties()
    }, [])

    useEffect(() => {
        if (selectedFaculty) {
            setIsLoading((prev) => ({...prev, buildings: true}));
            fetchBuildings(selectedFaculty.name);
        } else {
            setBuildings([]);
            setSelectedBuilding(null);
        }
    }, [selectedFaculty])

    const fetchFaculties = async () => {
        const response = await fetch(`http://localhost:8000/admin_paths/get_all_faculty`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        })
        const data = await response.json()
        setFaculties(data.faculties)
        setIsLoading({...isLoading, faculties: false})
    }

    const fetchBuildings = async (facultyName: string) => {
        const response = await fetch(`http://localhost:8000/admin_paths/get_buildings_by_faculty/${facultyName}`)
        const data = await response.json()
        const buildingsWithRooms = data.buildings.map((building: any) => ({
            id: building.id,
            name: building.name,
            RoomToRent: building.RoomToRent,
            RoomWithItems: building.RoomWithItems
        }))
        setBuildings(buildingsWithRooms)
        setIsLoading({...isLoading, buildings: false})
    }

    const handleAddFaculty = async (e: FormEvent) => {
        e.preventDefault()
        const response = await fetch(`http://localhost:8000/admin_paths/add_faculty`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({faculty_name: newFaculty})
        })
        if (response.ok) {
            fetchFaculties()
            setNewFaculty('')
        }
    }

    const handleAddBuilding = async (e: FormEvent) => {
        e.preventDefault()
        if (selectedFaculty) {
            const response = await fetch(`http://localhost:8000/admin_paths/add_building`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({building_name: newBuilding, faculty_name: selectedFaculty.name})
            })
            if (response.ok) {
                fetchBuildings(selectedFaculty.name)
                setNewBuilding('')
            }
        }
    }

    const handleAddRoom = async (e: FormEvent) => {
        e.preventDefault()
        if (selectedBuilding) {
            const response = await fetch(`http://localhost:8000/admin_paths/add_room`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    room_number: newRoom,
                    is_room_for_rent: isRoomForRent,
                    building_name: selectedBuilding.name,
                    faculty_name: selectedFaculty!.name
                })
            })
            if (response.ok) {
                fetchBuildings(selectedFaculty!.name)
                setNewRoom('')
            }
        }
    }

    const handleRemoveFaculty = async (id: number) => {
        const response = await fetch(`http://localhost:8000/admin_paths/delete_faculty/${id}`, {method: 'DELETE'})
        if (response.ok) {
            fetchFaculties()
            if (selectedFaculty?.id === id) {
                setSelectedFaculty(null)
            }
        }
    }

    const handleRemoveBuilding = async (id: number) => {
        const response = await fetch(`http://localhost:8000/admin_paths/remove_building/${id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
        })
        if (response.ok) {
            fetchBuildings(selectedFaculty!.name)
            if (selectedBuilding?.id === id) {
                setSelectedBuilding(null)
            }
        }
    }

    const handleRemoveRoom = async (id: number, isRoomForRent: boolean) => {
        const response = await fetch(`http://localhost:8000/admin_paths/remove_room`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({room_id: id, is_room_for_rent: isRoomForRent})
        })
        if (response.ok) {
            fetchBuildings(selectedFaculty!.name)
        }
    }

    const handleFacultySelect = (faculty: Faculty) => {
        setSelectedFaculty(faculty);
        setSelectedBuilding(null);
    };

    const handleBuildingSelect = (building: Building) => {
        setSelectedBuilding(building);
        setRooms([...building.RoomToRent, ...building.RoomWithItems])
    };

    return (
        <div className="container mx-auto py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Wydziały</h2>
                        <Dialog open={openDialogs.faculty}
                                onOpenChange={(open) => setOpenDialogs((prev) => ({...prev, faculty: open}))}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <PlusCircle className="h-4 w-4"/>
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
                    <div
                        className={`transition-opacity duration-300 ${isLoading.faculties ? 'opacity-50' : 'opacity-100'}`}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nazwa</TableHead>
                                    <TableHead className="text-right">Akcje</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {faculties.map((faculty) => (
                                    <TableRow key={faculty.id}
                                              className={selectedFaculty?.id === faculty.id ? 'bg-muted' : ''}>
                                        <TableCell className="font-medium">
                                            <Button variant="ghost" className="w-full justify-start gap-2"
                                                    onClick={() => handleFacultySelect(faculty)}>
                                                <GraduationCap className="h-4 w-4"/>
                                                {faculty.name}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="destructive" size="icon"
                                                    onClick={() => handleRemoveFaculty(faculty.id)}>
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Budynki</h2>
                        <Dialog open={openDialogs.building}
                                onOpenChange={(open) => setOpenDialogs((prev) => ({...prev, building: open}))}>
                            <DialogTrigger asChild>
                                <Button className="gap-2" disabled={!selectedFaculty}>
                                    <PlusCircle className="h-4 w-4"/>
                                    Dodaj Budynek
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Dodaj Budynek</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddBuilding} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="building-name">Nazwa Budynku</Label>
                                        <Input
                                            id="building-name"
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
                    <div
                        className={`transition-opacity duration-300 ${isLoading.buildings ? 'opacity-50' : 'opacity-100'}`}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nazwa</TableHead>
                                    <TableHead className="text-right">Akcje</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {buildings.map((building) => (
                                    <TableRow key={building.id}
                                              className={selectedBuilding?.id === building.id ? 'bg-muted' : ''}>
                                        <TableCell className="font-medium">
                                            <Button variant="ghost" className="w-full justify-start gap-2"
                                                    onClick={() => handleBuildingSelect(building)}>
                                                <Building className="h-4 w-4"/>
                                                {building.name}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="destructive" size="icon"
                                                    onClick={() => handleRemoveBuilding(building.id)}>
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Pokoje</h2>
                        <Dialog open={openDialogs.room}
                                onOpenChange={(open) => setOpenDialogs((prev) => ({...prev, room: open}))}>
                            <DialogTrigger asChild>
                                <Button className="gap-2" disabled={!selectedBuilding}>
                                    <PlusCircle className="h-4 w-4"/>
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
                                    <div className="space-y-2">
                                        <Label htmlFor="room-type">Typ Pokoju</Label>
                                        <select
                                            id="room-type"
                                            value={isRoomForRent ? 'rent' : 'items'}
                                            onChange={(e) => setIsRoomForRent(e.target.value === 'rent')}
                                            className="w-full p-2 border rounded"
                                        >
                                            <option value="items">Pokój z przedmiotami</option>
                                            <option value="rent">Pokój do wynajęcia</option>
                                        </select>
                                    </div>
                                    <Button type="submit">Dodaj</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div
                        className={`transition-opacity duration-300 ${isLoading.rooms ? 'opacity-50' : 'opacity-100'}`}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Numer</TableHead>
                                    <TableHead>Typ</TableHead>
                                    <TableHead className="text-right">Akcje</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rooms.map((room) => (
                                    <TableRow key={room.id}
                                              className={selectedRoom?.id === room.id ? 'bg-muted' : ''}>
                                        <TableCell className="font-medium">
                                            <Button variant="ghost" className="w-full justify-start gap-2"
                                                    onClick={() => setSelectedRoom(room)}>
                                                <DoorClosed className="h-4 w-4"/>
                                                {room.room_number}
                                            </Button>
                                        </TableCell>
                                        <TableCell>{room.is_to_rent ? 'Do wynajęcia' : 'Z przedmiotami'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="destructive" size="icon"
                                                    onClick={() => handleRemoveRoom(room.id, room.is_to_rent)}>
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}
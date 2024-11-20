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
import { Switch } from "@/components/ui/switch"
import { UserPlus, Trash2 } from 'lucide-react'

export function UsersMagnetComponent() {
    const [admins, setAdmins] = useState([
        { id: 1, login: 'admin1' },
        { id: 2, login: 'admin2' },
    ])
    const [students, setStudents] = useState([
        { id: 1, login: 'student1' },
        { id: 2, login: 'student2' },
    ])
    const [newAdmin, setNewAdmin] = useState({ login: '', password: '', isSuperAdmin: false })
    const [newStudent, setNewStudent] = useState({ login: '', password: '' })

    const handleAddAdmin = (e: FormEvent) => {
        e.preventDefault()
        setAdmins([...admins, { id: admins.length + 1, login: newAdmin.login }])
        setNewAdmin({ login: '', password: '', isSuperAdmin: false })
    }

    const handleAddStudent = (e: FormEvent) => {
        e.preventDefault()
        setStudents([...students, { id: students.length + 1, login: newStudent.login }])
        setNewStudent({ login: '', password: '' })
    }

    const handleRemoveAdmin = (id: number) => {
        setAdmins(admins.filter(admin => admin.id !== id))
    }

    const handleRemoveStudent = (id: number) => {
        setStudents(students.filter(student => student.id !== id))
    }

    return (
        <div className="container mx-auto py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Administratorzy</h2>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Dodaj Admina
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Dodaj Administratora</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddAdmin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="admin-login">Login</Label>
                                        <Input
                                            id="admin-login"
                                            value={newAdmin.login}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewAdmin({ ...newAdmin, login: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="admin-password">Hasło</Label>
                                        <Input
                                            id="admin-password"
                                            type="password"
                                            value={newAdmin.password}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="super-admin"
                                            checked={newAdmin.isSuperAdmin}
                                            onCheckedChange={(checked) => setNewAdmin({ ...newAdmin, isSuperAdmin: checked })}
                                        />
                                        <Label htmlFor="super-admin">Super Admin</Label>
                                    </div>
                                    <Button type="submit">Dodaj</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Login</TableHead>
                                <TableHead className="text-right">Akcje</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {admins.map((admin) => (
                                <TableRow key={admin.id}>
                                    <TableCell className="font-medium">{admin.login}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="destructive" size="icon" onClick={() => handleRemoveAdmin(admin.id)}>
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
                        <h2 className="text-2xl font-bold">Studenci</h2>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Dodaj Studenta
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Dodaj Studenta</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddStudent} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="student-login">Login</Label>
                                        <Input
                                            id="student-login"
                                            value={newStudent.login}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewStudent({ ...newStudent, login: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="student-password">Hasło</Label>
                                        <Input
                                            id="student-password"
                                            type="password"
                                            value={newStudent.password}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewStudent({ ...newStudent, password: e.target.value })}
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
                                <TableHead>Login</TableHead>
                                <TableHead className="text-right">Akcje</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.login}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="destructive" size="icon" onClick={() => handleRemoveStudent(student.id)}>
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
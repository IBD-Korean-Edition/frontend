'use client'

import {ChangeEvent, FormEvent, useEffect, useState} from 'react'
import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Switch} from "@/components/ui/switch"
import {Trash2, UserPlus} from 'lucide-react'
import {toast} from "sonner";

interface Admin {
    id: number
    login: string
    password: string
    isSuperAdmin: boolean
}

interface Student {
    id: number
    login: string
    password: string
}

export function UsersMagnetComponent() {
    const [admins, setAdmins] = useState<Admin[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const [newAdmin, setNewAdmin] = useState<Partial<Admin>>({login: '', password: '', isSuperAdmin: false})
    const [newStudent, setNewStudent] = useState<Partial<Student>>({login: '', password: ''})

    useEffect(() => {
        fetch(`http://localhost:8000/admin_paths/get_all_admins/${sessionStorage.getItem('admin_login')}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.admins && Array.isArray(data.admins)) {
                    const mappedAdmins = data.admins.map((admin: { id: any; login: any; super_admin: any }) => ({
                        id: admin.id,
                        login: admin.login,
                        password: '', // Assuming password is not returned for security reasons
                        isSuperAdmin: admin.super_admin
                    }));
                    setAdmins(mappedAdmins);
                } else {
                    console.error('Expected "admins" to be an array in the response');
                }
            })
            .catch(error => console.error('Fetch error for admins:', error));

        fetch('http://localhost:8000/admin_paths/get_all_students')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.students && Array.isArray(data.students)) {
                    setStudents(data.students);
                } else {
                    console.error('Expected "students" to be an array in the response');
                }
            })
            .catch(error => console.error('Fetch error for students:', error));
    }, []);

    const handleAddAdmin = (e: FormEvent) => {
        e.preventDefault()
        const studentData = {
            username: newAdmin.login,
            password: newAdmin.password
        }
        fetch('http://localhost:8000/admin_paths/add_admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData)
        })
            .then(response => {
                if (response.status === 401 || response.status === 403) {
                    toast.error('Unauthorized');
                    return;
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    setAdmins([...admins, data]);
                    setNewAdmin({login: '', password: '', isSuperAdmin: false});
                }
            })
            .catch(error => console.error('Error:', error));
    }

    const handleAddStudent = (e: FormEvent) => {
        e.preventDefault()
        const studentData = {
            username: newStudent.login,
            password: newStudent.password
        }
        fetch('http://localhost:8000/admin_paths/add_student', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(studentData)
        })
            .then(response => response.json())
            .then(data => setStudents([...students, data]))
        setNewStudent({login: '', password: ''})
    }

    const handleRemoveAdmin = (id: number) => {
        fetch(`http://localhost:8000/admin_paths/delete_admin/${id}`, {method: 'DELETE'})
            .then(() => setAdmins(admins.filter(admin => admin.id !== id)))
    }

    const handleRemoveStudent = (id: number) => {
        fetch(`http://localhost:8000/admin_paths/delete_student/${id}`, {method: 'DELETE'})
            .then(() => setStudents(students.filter(student => student.id !== id)))
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
                                    <UserPlus className="h-4 w-4"/>
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
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewAdmin({
                                                ...newAdmin,
                                                login: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="admin-password">Hasło</Label>
                                        <Input
                                            id="admin-password"
                                            type="password"
                                            value={newAdmin.password}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewAdmin({
                                                ...newAdmin,
                                                password: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="super-admin"
                                            checked={newAdmin.isSuperAdmin}
                                            onCheckedChange={(checked) => setNewAdmin({
                                                ...newAdmin,
                                                isSuperAdmin: checked
                                            })}
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
                                        <Button variant="destructive" size="icon"
                                                onClick={() => handleRemoveAdmin(admin.id)}>
                                            <Trash2 className="h-4 w-4"/>
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
                                    <UserPlus className="h-4 w-4"/>
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
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewStudent({
                                                ...newStudent,
                                                login: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="student-password">Hasło</Label>
                                        <Input
                                            id="student-password"
                                            type="password"
                                            value={newStudent.password}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewStudent({
                                                ...newStudent,
                                                password: e.target.value
                                            })}
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
                                        <Button variant="destructive" size="icon"
                                                onClick={() => handleRemoveStudent(student.id)}>
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
    )
}
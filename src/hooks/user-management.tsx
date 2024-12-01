'use client'

import {ChangeEvent, FormEvent, useEffect, useState, useCallback} from 'react'
import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Switch} from "@/components/ui/switch"
import {Trash2, UserPlus} from 'lucide-react'
import {toast} from "sonner"
import {z} from 'zod';

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
    const [shouldRefresh, setShouldRefresh] = useState(false)

    const fetchData = useCallback(async () => {
        try {
            const adminResponse = await fetch(`http://localhost:8000/admin_paths/get_all_admins/${sessionStorage.getItem('admin_login')}`)
            const adminData = await adminResponse.json()
            if (adminData.admins && Array.isArray(adminData.admins)) {
                const mappedAdmins = adminData.admins.map((admin: { id: any; login: any; super_admin: any }) => ({
                    id: admin.id,
                    login: admin.login,
                    password: '',
                    isSuperAdmin: admin.super_admin
                }))
                setAdmins(mappedAdmins)
            }

            const studentResponse = await fetch('http://localhost:8000/admin_paths/get_all_students')
            const studentData = await studentResponse.json()
            if (studentData.students && Array.isArray(studentData.students)) {
                setStudents(studentData.students)
            }
        } catch (error) {
            console.error('Fetch error:', error)
            toast.error('Nie udało się załadować danych')
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData, shouldRefresh])

    const adminSchema = z.object({
        username: z.string().regex(/^\d{6}$/, 'Login must be a string of 6 digits'),
        password: z.string().min(8, 'Password must be at least 8 characters long')
    });

    const studentSchema = z.object({
        username: z.string().regex(/^\d{6}$/, 'Login must be a string of 6 digits'),
        password: z.string().min(8, 'Password must be at least 8 characters long')
    });

    const handleAddAdmin = async (e: FormEvent) => {
        e.preventDefault();
        const adminData = {
            username: newAdmin.login,
            password: newAdmin.password
        };

        const validation = adminSchema.safeParse(adminData);
        if (!validation.success) {
            validation.error.errors.forEach(err => toast.error(err.message));
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/admin_paths/add_admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adminData)
            });
            if (response.status === 401 || response.status === 403) {
                toast.error('Brak uprawnień');
                return;
            }
            const data = await response.json();
            if (data) {
                setNewAdmin({login: '', password: '', isSuperAdmin: false});
                toast.success('Administrator dodany pomyślnie');
                setShouldRefresh(prev => !prev);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Nie udało się dodać administratora');
        }
    };

    const handleAddStudent = async (e: FormEvent) => {
        e.preventDefault();
        const studentData = {
            username: newStudent.login,
            password: newStudent.password
        };

        const validation = studentSchema.safeParse(studentData);
        if (!validation.success) {
            validation.error.errors.forEach(err => toast.error(err.message));
            return;
        }

        try {
            await fetch('http://localhost:8000/admin_paths/add_student', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(studentData)
            });
            setNewStudent({login: '', password: ''});
            toast.success('Student dodany pomyślnie');
            setShouldRefresh(prev => !prev);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Nie udało się dodać studenta');
        }
    };

    const handleRemoveAdmin = async (id: number) => {
        try {
            await fetch(`http://localhost:8000/admin_paths/delete_admin/${id}`, {method: 'DELETE'})
            toast.success('Administrator usunięty pomyślnie')
            setShouldRefresh(prev => !prev)
        } catch (error) {
            console.error('Error:', error)
            toast.error('Nie udało się usunąć administratora')
        }
    }

    const handleRemoveStudent = async (id: number) => {
        try {
            await fetch(`http://localhost:8000/admin_paths/delete_student/${id}`, {method: 'DELETE'})
            toast.success('Student usunięty pomyślnie')
            setShouldRefresh(prev => !prev)
        } catch (error) {
            console.error('Error:', error)
            toast.error('Nie udało się usunąć studenta')
        }
    }

    return (
        <div className="container mx-auto py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Admin section */}
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


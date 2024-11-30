'use client'

import React, {useEffect, useState} from 'react'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {Plus, Trash2} from 'lucide-react'
import {toast} from "sonner"

interface Type {
    id: number
    type_name: string
}

interface Attribute {
    id: number
    attribute_name: string
}

export function TypesAndAttributesTables() {
    const [types, setTypes] = useState<Type[]>([])
    const [attributes, setAttributes] = useState<Attribute[]>([])
    const [newType, setNewType] = useState('')
    const [newAttribute, setNewAttribute] = useState('')
    const [isLoading, setIsLoading] = useState({types: true, attributes: true})
    const [openDialogs, setOpenDialogs] = useState({type: false, attribute: false})

    useEffect(() => {
        fetchTypes()
        fetchAttributes()
    }, [])

    const fetchTypes = async () => {
        try {
            const response = await fetch(`http://localhost:8000/admin_paths/types`)

            const data = await response.json()

            if (response.ok) {
                setTypes(data.types)
                toast.success("Types fetched successfully")
            } else {
                toast.error(data.error)
            }

        } catch (error) {
            toast("Failed to fetch types")
        } finally {
            setIsLoading(prev => ({...prev, types: false}))
        }
    }

    const fetchAttributes = async () => {
        try {
            const response = await fetch(`http://localhost:8000/admin_paths/attributes`)

            const data = await response.json()

            if (response.ok) {
                setAttributes(data.attributes)
                toast.success("Attributes fetched successfully")
            } else {
                toast.error(data.error)
            }

        } catch (error) {
            toast("Failed to fetch attributes")
        } finally {
            setIsLoading(prev => ({...prev, attributes: false}))
        }
    }

    const handleCreateType = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch(`http://localhost:8000/admin_paths/types/create`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({type_name: newType})
            })

            const data = await response.json()

            if (response.ok) {
                await fetchTypes()
                setNewType('')
                setOpenDialogs(prev => ({...prev, type: false}))
                toast.success(data.message)
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            toast("Failed to create type destructive")
        }
    }

    const handleCreateAttribute = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch(`http://localhost:8000/admin_paths/attributes/create`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({attribute_name: newAttribute})
            })

            const data = await response.json()

            if (response.ok) {
                await fetchAttributes()
                setNewAttribute('')
                setOpenDialogs(prev => ({...prev, attribute: false}))
                toast.success(data.message)
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            toast("Failed to create attribute destructive")
        }
    }

    const handleDeleteType = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8000/admin_paths/types/delete`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id})
            })

            const data = await response.json()

            if (response.ok) {
                await fetchTypes()
                toast.success(data.message)
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            toast("Failed to delete type destructive")
        }
    }

    const handleDeleteAttribute = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8000/admin_paths/attributes/delete`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id})
            })

            const data = await response.json()

            if (response.ok) {
                await fetchAttributes()
                toast.success(data.message)
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            toast("Failed to delete attribute destructive")
        }
    }

    return (
        <div className="container mx-auto py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl font-bold">Typ</CardTitle>
                        <Dialog open={openDialogs.type}
                                onOpenChange={(open) => setOpenDialogs(prev => ({...prev, type: open}))}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4"/>
                                    Dodaj typ
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Dodaj nowy typ</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreateType} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="type-name">Type Name</Label>
                                        <Input
                                            id="type-name"
                                            value={newType}
                                            onChange={(e) => setNewType(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button type="submit">Dodaj typ</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <div
                            className={`transition-opacity duration-300 ${isLoading.types ? 'opacity-50' : 'opacity-100'}`}>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nazwa</TableHead>
                                        <TableHead className="text-right">Akcja</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {types.map((type) => (
                                        <TableRow key={type.id}>
                                            <TableCell className="font-medium">{type.type_name}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="destructive" size="icon"
                                                        onClick={() => handleDeleteType(type.id)}>
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl font-bold">Atrybuty</CardTitle>
                        <Dialog open={openDialogs.attribute}
                                onOpenChange={(open) => setOpenDialogs(prev => ({...prev, attribute: open}))}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4"/>
                                    Dodaj atrybut
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Dodaj nowy atrybut</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreateAttribute} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="attribute-name">Nazwa atrybuty</Label>
                                        <Input
                                            id="attribute-name"
                                            value={newAttribute}
                                            onChange={(e) => setNewAttribute(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button type="submit">Dodaj atrybuty</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <div
                            className={`transition-opacity duration-300 ${isLoading.attributes ? 'opacity-50' : 'opacity-100'}`}>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nazwa</TableHead>
                                        <TableHead className="text-right">Akcja</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attributes.map((attribute) => (
                                        <TableRow key={attribute.id}>
                                            <TableCell className="font-medium">{attribute.attribute_name}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="destructive" size="icon"
                                                        onClick={() => handleDeleteAttribute(attribute.id)}>
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
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


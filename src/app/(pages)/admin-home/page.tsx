'use client'

import React, {useState} from 'react'
import {toast} from "sonner"
import {Button} from "@/components/ui/button"
import {Home, Users, Building, RotateCcw, Laptop, History, Tags, User, LogOut} from 'lucide-react'
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {ModeToggle} from "@/components/ModeToggle"
import Link from 'next/link'
import {UsersMagnetComponent} from "@/hooks/user-management"
import {FacultyManagement} from "@/app/(pages)/admin-home/faculty-management"
import {AdminReturnsManagement} from "@/app/(pages)/admin-home/admin-returns-management"
import {ItemManagement} from "@/app/(pages)/admin-home/item-management"
import {BookingsTable} from "@/app/(pages)/admin-home/bookings-table"
import {TypesAndAttributesTables} from "@/app/(pages)/admin-home/types-and-attributes-tables"
import {Card, CardHeader, CardTitle} from "@/components/ui/card"

const navItems = [
    {label: 'Strona główna', icon: Home, description: 'Przegląd wszystkich funkcji administratora'},
    {label: 'Użytkownicy', icon: Users, description: 'Zarządzaj kontami użytkowników i uprawnieniami'},
    {label: 'Wydziały', icon: Building, description: 'Zarządzaj informacjami i ustawieniami wydziałów'},
    {label: 'Zwroty', icon: RotateCcw, description: 'Przetwarzaj zwroty przedmiotów i sal'},
    {label: 'Przedmioty', icon: Laptop, description: 'Zarządzaj inwentarzem przedmiotów do wypożyczenia'},
    {label: 'Historia zwrotów', icon: History, description: 'Przeglądaj historię wszystkich zwrotów'},
    {label: 'Typy i atrybuty', icon: Tags, description: 'Konfiguruj typy przedmiotów i ich atrybuty'}
]

function AdminTile({label, icon: Icon, description, onClick}: {label: string, icon: React.ComponentType, description: string, onClick: () => void}) {
    return (
        <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={onClick}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <Icon className="h-8 w-8 text-primary mr-4"/>
                <div>
                    <CardTitle className="text-lg font-bold">{label}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                </div>
            </CardHeader>
        </Card>
    )
}

export default function StudentRentalPage() {
    const [selectedItem, setSelectedItem] = useState(navItems[0].label)

    const renderContent = () => {
        switch (selectedItem) {
            case 'Strona główna':
                return (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {navItems.slice(1).map((item) => (
                            <AdminTile
                                key={item.label}
                                label={item.label}
                                icon={item.icon}
                                description={item.description}
                                onClick={() => setSelectedItem(item.label)}
                            />
                        ))}
                    </div>
                )
            case 'Użytkownicy':
                return <UsersMagnetComponent/>
            case 'Wydziały':
                return <FacultyManagement/>
            case 'Zwroty':
                return <AdminReturnsManagement/>
            case 'Przedmioty':
                return <ItemManagement/>
            case 'Historia zwrotów':
                return <BookingsTable/>
            case 'Typy i atrybuty':
                return <TypesAndAttributesTables/>
            default:
                return <div>Content for {selectedItem}</div>
        }
    }

    return (
        <div className="flex h-screen bg-background text-foreground">
            <nav className="w-64 bg-card border-r border-border">
                <div className="p-4 border-b border-border flex items-center space-x-2">
                    <Home className="h-6 w-6 text-primary"/>
                    <h1 className="text-xl font-bold">AcadEquip</h1>
                </div>
                <ul className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <li key={item.label}>
                            <Button
                                variant={selectedItem === item.label ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => setSelectedItem(item.label)}
                            >
                                <item.icon className="mr-2 h-4 w-4"/>
                                {item.label}
                            </Button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="flex-1 flex flex-col">
                <header className="bg-card border-b border-border p-4 flex justify-between items-center">
                    <div className="bg-card border-b border-border p-4 flex justify-between items-center"></div>
                    <div className="flex items-center space-x-4">
                        <ModeToggle/>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon">
                                    <User className="h-5 w-5"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                    <Link href="/welcome-page" className="flex items-center"
                                          onClick={() => toast("Logout success")}>
                                        <LogOut className="mr-2 h-4 w-4"/>
                                        Logout
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    )
}


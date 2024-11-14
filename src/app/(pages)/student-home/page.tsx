'use client'

import React, {useState} from 'react';
import {toast} from "sonner"
import {Button} from "@/components/ui/button";
import {Home, BookOpen, PocketKnife, Bell, User, LogOut, DoorOpen} from 'lucide-react';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {ModeToggle} from "@/components/ModeToggle";
import Link from 'next/link';
// import {jwtDecode} from "jwt-decode";

const navItems = [
    {label: 'Home', icon: Home},
    {label: 'Items', icon: PocketKnife},
    {label: 'Rooms', icon: DoorOpen},
    {label: 'My booking', icon: BookOpen},
];

export default function StudentRentalPage() {
    const [selectedItem, setSelectedItem] = useState(navItems[0].label);

    // useEffect(() => {
    //     const token = localStorage.getItem('jwt_accessToken');
    //     if (!token) {
    //         window.location.href = '/login';
    //         return;
    //     }
    //
    //     try {
    //         const decodedToken = jwtDecode<{ exp: number }>(token);
    //         if (decodedToken.exp * 1000 < Date.now()) {
    //             localStorage.removeItem('jwt_accessToken');
    //             window.location.href = '/login';
    //         }
    //     } catch (error) {
    //         console.error('Error decoding token:', error);
    //         localStorage.removeItem('jwt_accessToken');
    //         window.location.href = '/login';
    //     }
    // }, []);

    const renderContent = () => {
        switch (selectedItem) {
            case 'Home':
                return <div>Welcome to the Academic Equipment Rental System</div>;
            case 'Announcements':
                return <div>Announcements content</div>;
            case 'Payments':
                return <div>Payments content</div>;
            case 'Documents':
                return <div>Documents content</div>;
            case 'Rentals':
                return <div>Rentals content</div>;
            default:
                return <div>Content for {selectedItem}</div>;
        }
    };

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
                    <div className="flex items-center space-x-4 ml-auto">
                        <ModeToggle/>
                        <Button variant="secondary" size="icon">
                            <Bell className="h-5 w-5"/>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon">
                                    <User className="h-5 w-5"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                    <Link href="/welcome-page" className="flex items-center" onClick={() => toast("Logout success")}>
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
    );
}
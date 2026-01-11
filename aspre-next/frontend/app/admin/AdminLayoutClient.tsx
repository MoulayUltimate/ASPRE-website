'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminLayout.module.css';

export default function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { name: 'Analytics', path: '/admin', icon: 'fa-chart-line' },
        { name: 'Live Chat', path: '/admin/chat', icon: 'fa-comments' },
        { name: 'Payments', path: '/admin/payments', icon: 'fa-credit-card' },
        { name: 'Pricing', path: '/admin/pricing', icon: 'fa-tag' },
        { name: 'Marketing', path: '/admin/marketing', icon: 'fa-bullhorn' },
        { name: 'Security', path: '/admin/security', icon: 'fa-shield-alt' },
    ];

    return (
        <div className={styles.adminContainer}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2>Aspire Admin</h2>
                </div>
                <nav className={styles.nav}>
                    <ul>
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={`${styles.navLink} ${pathname === item.path ? styles.active : ''
                                        }`}
                                >
                                    <i className={`fas ${item.icon}`} />
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className={styles.sidebarFooter}>
                    <button className={styles.logoutButton}>
                        <i className="fas fa-sign-out-alt" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <header className={styles.topHeader}>
                    <div className={styles.breadcrumbs}>
                        Admin / {navItems.find((i) => i.path === pathname)?.name || 'Dashboard'}
                    </div>
                    <div className={styles.userProfile}>
                        <span>Admin User</span>
                        <div className={styles.avatar}>A</div>
                    </div>
                </header>
                <div className={styles.contentArea}>{children}</div>
            </main>
        </div>
    );
}

import React from 'react';
import { NavLink } from 'react-router';
import styles from './Header.module.css';

const Header = ({title}) => {
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            <img src="/iconmonstr-task-list-square-filled.svg" alt="Checklist icon" />
            <nav className={styles.nav}>
                <NavLink
                to="/"
                className={({isActive}) => (isActive ? styles.active : styles.inactive)}>
                    Home
                </NavLink>
                <NavLink
                to="/about"
                className={({isActive})=> (isActive ? styles.active : styles.inactive)}>
                    About
                </NavLink>
            </nav>
        </header>
    );
};

export default Header;
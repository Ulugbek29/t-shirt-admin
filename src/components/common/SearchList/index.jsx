import React from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import FastfoodIcon from '@mui/icons-material/Fastfood';

export default function SearchList({ filteredProducts, handleProductClick,searchListRef }) {

    return (
        <List
            ref={searchListRef}
            sx={{
                position: "absolute",
                top: 80,
                width: '100%',
                maxWidth: 360,
                height: 200,
                bgcolor: 'white',
                zIndex: 2,
                borderRadius: 1,
                boxShadow: "0 5px 5px rgba(0,0,0,0.3)",
                overflowY: 'auto'
            }}
            component="nav"
        >
            {filteredProducts.map(product => (
                <ListItemButton key={product.id} onClick={() => handleProductClick(product)}>
                    <ListItemIcon>
                        <FastfoodIcon />
                    </ListItemIcon>
                    <ListItemText primary={product.name} />
                </ListItemButton>
            ))}
        </List>
    );
}

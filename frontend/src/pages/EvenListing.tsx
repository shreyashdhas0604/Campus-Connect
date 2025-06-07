import React from "react";
import { Box, Typography, Card, CardContent, CardMedia, Button, Stack } from "@mui/material";

const events = [
    {
        id: 1,
        title: "Music Concert",
        date: "2023-11-15",
        location: "Auditorium A",
        image: "https://via.placeholder.com/300x200",
    },
    {
        id: 2,
        title: "Art Exhibition",
        date: "2023-11-20",
        location: "Gallery Hall",
        image: "https://via.placeholder.com/300x200",
    },
    {
        id: 3,
        title: "Tech Meetup",
        date: "2023-11-25",
        location: "Conference Room",
        image: "https://via.placeholder.com/300x200",
    },
];

const EventListing: React.FC = () => {
    return (
        <Box sx={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom textAlign="center">
                Upcoming Events
            </Typography>
            <Stack
                direction="row"
                spacing={3}
                flexWrap="wrap"
                justifyContent="center"
                alignItems="flex-start"
            >
                {events.map((event) => (
                    <Box
                        key={event.id}
                        sx={{
                            width: { xs: "100%", sm: "calc(50% - 16px)", md: "calc(33.33% - 16px)" },
                            marginBottom: "16px",
                        }}
                    >
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                image={event.image}
                                alt={event.title}
                            />
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {event.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Date: {event.date}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Location: {event.location}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ marginTop: "10px" }}
                                    fullWidth
                                >
                                    View Details
                                </Button>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
};

export default EventListing;
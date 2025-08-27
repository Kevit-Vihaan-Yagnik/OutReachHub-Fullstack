import { Button, Container, Text, Title } from '@mantine/core';
import { Dots } from './Dots';
import classes from '../css/HeroText.module.css';

export default function HeroSection() {
    return (
        <Container className={classes.wrapper} size={1400}>
            <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
            <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
            <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
            <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

            <div className={classes.inner}>
                <Title className={classes.title} fw={600} size={75}>
                    Welcome To{' '}
                    <Text component="span" className={classes.highlight} inherit>
                        OutReachHub
                    </Text>{' '}
                </Title>

                <Container p={0} size={800}>
                    <Text size="lg" c="dimmed" className={classes.description}>
                        OutReachHub is designed to simplify the way you connect with people. Whether you’re building relationships with customers,
                        running outreach campaigns, or growing your brand, our platform gives you the tools to do it all in one place.
                    </Text>
                </Container>

                <div className={classes.controls}>
                    <Button className={classes.control} size="lg" variant="default" color="gray">
                        Book a demo
                    </Button>
                    <Button className={classes.control} size="lg">
                        Purchase a license
                    </Button>
                </div>
            </div>
        </Container>
    );
}
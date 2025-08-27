import { Container, Title, Grid, List, ThemeIcon, AspectRatio } from "@mantine/core";
import {  IconCircleCheck, IconCircleDashed } from "@tabler/icons-react";

export function FeatureBlog() {
    return (
        <Container size="lg" py={60}>
            <Grid justify="center">
                <Grid.Col span={{base : 12 , sm : 6}}>
                    <Grid.Col >
                        <Title>
                            What benifit will you get
                        </Title>
                    </Grid.Col>
                    <Grid.Col mt={'xl'}>
                        <List
                            spacing="xs"
                            size="sm"
                            center
                            icon={
                                <ThemeIcon color="teal" size={24} radius="xl">
                                    <IconCircleCheck size={16} />
                                </ThemeIcon>
                            }
                        >
                            <List.Item>Clone or download repository from GitHub</List.Item>
                            <List.Item>Install dependencies with yarn</List.Item>
                            <List.Item>To start development server run npm start command</List.Item>
                            <List.Item>Run tests to make sure your changes do not break the build</List.Item>
                            <List.Item
                                icon={
                                    <ThemeIcon color="blue" size={24} radius="xl">
                                        <IconCircleDashed size={16} />
                                    </ThemeIcon>
                                }
                            >
                                Submit a pull request once you are done
                            </List.Item>
                        </List>
                    </Grid.Col>
                </Grid.Col>

                <Grid.Col span={4} visibleFrom="sm" pt={'lg'}>
                    <AspectRatio ratio={1090 / 720} maw={400}>
                        <img
                            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png"
                            alt="Panda"
                        />
                    </AspectRatio>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
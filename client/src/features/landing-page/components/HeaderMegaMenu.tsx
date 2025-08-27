import {
    IconMoon,
    IconSun,
    IconWaveSawTool,
} from '@tabler/icons-react';
import {
    ActionIcon,
    Box,
    Burger,
    Button,
    Divider,
    Drawer,
    Group,
    ScrollArea,
    Text,
    useComputedColorScheme,
    useMantineColorScheme,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from '../css/HeaderMegaMenu.module.css';
import cx from 'clsx';
import buttonClasses from '../css/ActionToggle.module.css';


export function HeaderMegaMenu() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const theme = useMantineTheme();

    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true });


    return (
        <Box pb={120} pos={'sticky'} left={0} top={0} style={{zIndex: 100000}}>
            <header className={classes.header}
                style={{
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                }}
            >
                <Group justify="space-between" h="100%">
                    <Button color='none' leftSection={<IconWaveSawTool color={
                        computedColorScheme === 'dark'
                            ? theme.colors.blue[4] // lighter shade for dark mode
                            : theme.colors.blue[7] // darker shade for light mode
                    } />}
                        styles={{
                            root: {
                                background: 'transparent',
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                    background: 'transparent', // prevent color change
                                    transform: 'scale(1.05)',  // zoom effect
                                },
                            },
                        }}
                    >
                        <Text
                            size="xl"
                            fw={1000}
                            variant="gradient"
                            gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                        >
                            OutReachHub
                        </Text>
                    </Button>
                    <Group h="100%" gap={0} visibleFrom="sm">
                        <a href="#" className={classes.link}>
                            Home
                        </a>
                        <a href="#" className={classes.link}>
                            Features
                        </a>
                        <a href="#" className={classes.link}>
                            Pricing
                        </a>
                        <a href="#" className={classes.link}>
                            FAQS
                        </a>
                    </Group>

                    <Group visibleFrom="sm">
                        <Button>Get Started</Button>

                        <ActionIcon
                            onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                            variant="default"
                            size="xl"
                            radius="md"
                            aria-label="Toggle color scheme"
                        >
                            <IconSun className={cx(buttonClasses.icon, buttonClasses.light)} stroke={1.5} />
                            <IconMoon className={cx(buttonClasses.icon, buttonClasses.dark)} stroke={1.5} />
                        </ActionIcon>
                    </Group>

                    <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
                </Group>
            </header>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Navigation"
                hiddenFrom="sm"
                zIndex={1000000}
            >
                <ScrollArea h="calc(100vh - 80px" mx="-md">
                    <Divider my="sm" />

                    <a href="#" className={classes.link}>
                        Home
                    </a>
                    <a href="#" className={classes.link}>
                        Learn
                    </a>
                    <a href="#" className={classes.link}>
                        Academy
                    </a>

                    <Divider my="sm" />

                    <Group justify="center" grow pb="xl" px="md">
                        <Button>Get Started</Button>
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box>
    );
}
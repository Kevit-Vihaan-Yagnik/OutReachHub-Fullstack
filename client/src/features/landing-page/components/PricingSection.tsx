import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  SegmentedControl,
  SimpleGrid,
  Card,
  List,
  ThemeIcon,
  Button,
  Badge,
  Grid,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

export function PricingSection() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');

  const isYearly = billing === 'yearly';

  const plans = [
    {
      name: 'Free',
      description: 'Get started with basic outreach tools',
      price: 0,
      features: [
        '2 Users',
        'Basic Campaigns',
        'Public Sharing',
        'Email Support',
        'Limited Integrations',
      ],
      buttonText: 'Sign up for free',
      buttonVariant: 'outline',
      highlighted: false,
      savings: null,
    },
    {
      name: 'Pro',
      description: 'Unlock advanced features for growing teams',
      price: isYearly ? 8 : 12,
      features: [
        '5 Users',
        'Unlimited Campaigns',
        'Advanced Analytics',
        'Team Collaboration',
        'Priority Support',
      ],
      buttonText: 'Go to Pro',
      buttonVariant: 'filled',
      highlighted: true,
      savings: isYearly ? 48 : null, // 12*12 - 8*12 = 144 - 96 = 48 ≈ 50
    },
    {
      name: 'Business',
      description: 'Enterprise-grade solutions for large organizations',
      price: isYearly ? 16 : 24,
      features: [
        'Unlimited Users',
        'All Pro Features',
        'Dedicated Account Manager',
        'Single Sign-On (SSO)',
        'Custom Integrations',
      ],
      buttonText: 'Go to Business',
      buttonVariant: 'outline',
      highlighted: false,
      savings: isYearly ? 96 : null, // 24*12 - 16*12 = 288 - 192 = 96
    },
  ];

  return (
    <Container size="lg" py="xl">
      <Title order={1} ta="center" mb="xs">
        Choose the Plan That&apos;s Right for You
      </Title>
      <Text c="dimmed" ta="center" mb="md">
        Select the plan that best fits your outreach needs. Feel free to contact us for custom solutions.
      </Text>
      <Grid justify='center'>
        <SegmentedControl
          data={[
            { label: 'Bill Monthly', value: 'monthly' },
            { label: 'Bill Yearly', value: 'yearly' },
          ]}
          value={billing}
          onChange={(value) => setBilling(value as 'monthly' | 'yearly')}
          mb="xl"
          style={{ alignSelf: 'center' }}
        />
      </Grid>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            shadow="md"
            radius="md"
            p="lg"
            withBorder={!plan.highlighted}
          >
            <Text fw={500} size="lg" mb="xs">
              {plan.name}
            </Text>
            <Text c="dimmed" size="sm" mb="md">
              {plan.description}
            </Text>
            <Title order={1} mb="xs">
              ${plan.price}
            </Title>
            {plan.savings && (
              <Badge color="green" variant="light" mb="md">
                Save ${plan.savings} a year
              </Badge>
            )}
            <List
              spacing="xs"
              size="sm"
              center
              icon={
                <ThemeIcon color="teal" variant="light" radius="xl">
                  <IconCheck size={16} />
                </ThemeIcon>
              }
              mb="md"
            >
              {plan.features.map((feature) => (
                <List.Item key={feature}>{feature}</List.Item>
              ))}
            </List>
            <Button
              fullWidth
              variant={plan.buttonVariant}
              color={plan.highlighted ? 'green' : 'blue'}
              radius="md"
            >
              {plan.buttonText}
            </Button>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}
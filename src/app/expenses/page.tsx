"use client";
import React from 'react';
import Layout from '../components/Layout';
import SlidingInfoBanner from '../components/SlidingInfoBanner';

type expensesInsightsType = {
    id : number,
    text : string 
}

const expensesInsights : expensesInsightsType[] = [
    { id: 1, text: "Total house spending this month: $1,250.00" },
    { id: 2, text: "You've spent $210.50 on groceries." },
    { id: 3, text: "Shared utilities are $150.00." },
    { id: 4, text: "Reminder: Rent is due in 3 days." },
];

export default function ExpensesPage() {
    return (
        <Layout houseName={"Expensify"}>
            <SlidingInfoBanner items={expensesInsights} />
        </Layout>
    );
}
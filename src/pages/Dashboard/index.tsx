"use client";

import { type FC } from "react";

import Header from "@/components/common/Header";

export const Dashboard: FC = () => {
  return (
    <>
      <Header />
      <br />
      <p style={{ textAlign: "center", fontWeight: "bold", fontSize: 24 }}>
        Olá Rato!
      </p>
    </>
  );
};

export default Dashboard;

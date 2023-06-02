import { AppLayout } from "../../layout/AppLayout.tsx";
import { Heading } from "@chakra-ui/react";
import { useApiClient } from "../../hooks/_useApiClient.ts";
import { useEffect, useState } from "react";
import { DiaryEntryTable } from "./DiaryEntryTable.tsx";
import { DiaryEntry } from "../../adapter/api/__generated";

export const HomePage = () => {
  const client = useApiClient();
  const [data, setData] = useState<DiaryEntry[] | null>(null);
  const loadData = async () => {
    try {
      const res = await client.getDiaryEntries();
      console.log(res);
      setData(res.data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  console.log(data);
  return (
    <AppLayout>
      <Heading>Home</Heading>
      <DiaryEntryTable
        data={data ?? []}
        onClickDeleteEntry={() => {}}
        onClickUpdateEntry={() => {}}
      />
    </AppLayout>
  );
};

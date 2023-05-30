import {
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { DiaryEntry } from "../../adapter/api/__generated";

export const DiaryEntryTable = ({
  data,
  onClickDeleteEntry,
  onClickUpdateEntry,
}: {
  data: DiaryEntry[];
  onClickDeleteEntry: (diaryEntry: DiaryEntry) => void;
  onClickUpdateEntry: (diaryEntry: DiaryEntry) => void;
}) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Titel</Th>
            <Th>Inhalt</Th>
            {/*<Th>Tags</Th>*/}
            <Th>Erstelldatum</Th>
            <Th>Aktionen</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((entry) => {
            return (
              <Tr>
                <Td>{entry.title}</Td>
                <Td>{entry.content}</Td>
                {/*<Td>*/}
                {/*  {entry.tags?.map((tag) => (*/}
                {/*    <Tag>{tag.name}</Tag>*/}
                {/*  ))}{" "}*/}
                {/*</Td>*/}
                <Td>{entry.createdAt}</Td>
                <Td>
                  <IconButton
                    aria-label={"Eintrag löschen"}
                    icon={<DeleteIcon />}
                    onClick={() => onClickDeleteEntry(entry)}
                  />{" "}
                  <IconButton
                    aria-label={"Eintrag bearbeiten"}
                    icon={<EditIcon />}
                    onClick={() => onClickUpdateEntry(entry)}
                  />{" "}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

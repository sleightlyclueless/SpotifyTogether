import styled from "styled-components";
import { RiPlayListAddLine } from "react-icons/ri";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #563a57;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75);
  position: absolute;
  bottom: 16px;
  right: calc(50% - 40px);
`;

export const NewPlaylistButton = () => {
  return (
    <Container>
      <RiPlayListAddLine />
    </Container>
  );
};

import { RiPlayListAddLine } from "react-icons/ri";
import { FunctionComponent } from "react";
import { BigButtonContainer } from "../../styles";

type NewPlaylistButtonProps = {
  onClick: () => void;
};

export const BigButton: FunctionComponent<NewPlaylistButtonProps> = ({
  onClick,
}) => {
  return (
    <BigButtonContainer>
      <RiPlayListAddLine onClick={onClick} />
    </BigButtonContainer>
  );
};

import { RiPlayListAddLine } from "react-icons/ri";
import { FunctionComponent } from "react";
import { RoundButton } from "../../styles";

type NewPlaylistButtonProps = {
  onClick: () => void;
};

export const BigButton: FunctionComponent<NewPlaylistButtonProps> = ({
  onClick,
}) => {
  return (
    <RoundButton>
      <RiPlayListAddLine onClick={onClick} />
    </RoundButton>
  );
};

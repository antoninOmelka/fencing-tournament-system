import { Participant } from "./participant";

export interface ParticipantTableProps {
    participants: Participant[];
}

export interface ParticipantFormProps {
    newParticipant: Omit<Participant, 'id'>;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSaveEdit: () => void;
} 
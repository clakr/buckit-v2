import { Badge } from "@/components/ui/badge";
import { baseExpenseParticipantSchema } from "@/lib/schemas";
import { Icon } from "@iconify/react";
import { z } from "zod";

export function ParticipantsBadgeList({
  participants,
  removeParticipant,
}: {
  participants: z.input<typeof baseExpenseParticipantSchema>[];
  removeParticipant: (index: number) => void;
}) {
  return participants.length === 0 ? (
    <p className="text-muted-foreground text-sm">No participants added yet.</p>
  ) : (
    <ul className="flex flex-wrap gap-2">
      {participants.map((participant, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="font-semibold"
          asChild
        >
          <li>
            {participant.name}
            <button
              type="button"
              className="grid size-4 cursor-pointer place-content-center"
              onClick={() => removeParticipant(index)}
            >
              <Icon icon="bx:x" />
            </button>
          </li>
        </Badge>
      ))}
    </ul>
  );
}

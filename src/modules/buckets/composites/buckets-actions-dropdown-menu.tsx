import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ArchiveBucketDialog from "@/modules/buckets/composites/archive-bucket-dialog";
import { Tables } from "@/supabase/database.types";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

type Props = { bucketId: Tables<"buckets">["id"] };

type DialogContent = "archive-bucket";

export default function BucketsActionsDropdownMenu({ bucketId }: Props) {
  const navigate = useNavigate({
    from: "/buckets",
  });

  const [dialogContent, setDialogContent] = useState<DialogContent | null>(
    null,
  );

  function DialogContent() {
    if (dialogContent === "archive-bucket") {
      return <ArchiveBucketDialog />;
    }

    return null;
  }

  function handleDropdownOpenChange(isOpen: boolean) {
    if (isOpen) return navigate({ search: { bucketId } });

    if (dialogContent !== null) return;

    return navigate({
      search: {
        bucketId: "",
      },
    });
  }

  function handleDialogOpenChange(isOpen: boolean) {
    if (isOpen) return navigate({ search: { bucketId } });

    setDialogContent(null);
    return navigate({
      search: {
        bucketId: "",
      },
    });
  }

  return (
    <Dialog onOpenChange={handleDialogOpenChange}>
      <DropdownMenu onOpenChange={handleDropdownOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4"
          >
            <Icon icon="bx:dots-vertical-rounded" className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link to="/buckets/$bucketId" params={{ bucketId }}>
              <Icon icon="bx:pencil" />
              Edit Bucket
            </Link>
          </DropdownMenuItem>
          <DialogTrigger
            onClick={() => setDialogContent("archive-bucket")}
            asChild
          >
            <DropdownMenuItem>
              <Icon icon="bx:archive" />
              Archive Bucket
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent />
    </Dialog>
  );
}

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ArchiveBucketDialog from "@/modules/buckets/composites/archive-bucket-dialog";
import UpdateBucketDialog from "@/modules/buckets/composites/update-bucket-dialog";
import { Tables } from "@/supabase/database.types";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

type Props = { bucketId: Tables<"buckets">["id"] };

type DialogContent = "archive-bucket" | "update-bucket";

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
    } else if (dialogContent === "update-bucket") {
      return <UpdateBucketDialog />;
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
          <Button size="icon" variant="ghost" className="-me-2 -mt-2">
            <Icon icon="bx:dots-vertical-rounded" className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DialogTrigger
            onClick={() => setDialogContent("update-bucket")}
            asChild
          >
            <DropdownMenuItem>
              <Icon icon="bx:pencil" />
              Update Bucket
            </DropdownMenuItem>
          </DialogTrigger>
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

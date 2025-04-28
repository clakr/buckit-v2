import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DistributeFundsDialog } from "@/modules/distributions/composites/distribute-funds-dialog";
import { useDistributeDropdownMenuStore } from "@/modules/distributions/stores";
import { Distribution } from "@/supabase/types";
import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import { useShallow } from "zustand/react/shallow";

type Props = { distributionId: Distribution["id"] };

export function DistributionsActionsDropdownMenu({ distributionId }: Props) {
  const { dialogContentState, setDialogContentState, setDistributionId } =
    useDistributeDropdownMenuStore(
      useShallow((state) => ({
        dialogContentState: state.dialogContentState,
        setDialogContentState: state.setDialogContentState,
        setDistributionId: state.setDistributionId,
      })),
    );

  function handleOnOpenChange() {
    setDistributionId(distributionId);
  }

  function handleTrigger(value: typeof dialogContentState) {
    setDialogContentState(value);
  }

  function DialogContentState() {
    if (dialogContentState === "distribute-funds") {
      return <DistributeFundsDialog />;
    }

    return null;
  }
  return (
    <Dialog>
      <DropdownMenu onOpenChange={handleOnOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Icon icon="bx:dots-horizontal-rounded" />
            <span className="sr-only">distribution actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Distributions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link
                to="/distributions/$distributionId/edit"
                params={{ distributionId }}
              >
                <Icon icon="bx:edit" />
                Edit
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Others</DropdownMenuLabel>
            <DialogTrigger
              onClick={() => handleTrigger("distribute-funds")}
              asChild
            >
              <DropdownMenuItem>
                <Icon icon="fluent-mdl2:distribute-down" />
                Distribute Funds
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogContentState />
      </DialogContent>
    </Dialog>
  );
}

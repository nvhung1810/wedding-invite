import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";

type InvalidCodeAlertProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function InvalidCodeAlert({ open, onOpenChange }: InvalidCodeAlertProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("alert.invalidCodeTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("alert.invalidCodeMessage")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => onOpenChange(false)}>
            {t("alert.ok")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

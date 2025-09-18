import CardSetting from "@/components/settings/card-setting";
import { getAllSettings } from "@/lib/setting";

export default async function SettingsPage() {
  const settings = await getAllSettings();
  return <CardSetting settings={settings} />;
}

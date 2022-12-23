﻿using Rectify11Installer.Core;
using Rectify11Installer.Win32;
using System;
using System.Globalization;
using System.IO;
using System.Runtime;
using System.Threading;
using System.Windows.Forms;

namespace Rectify11Installer
{
	internal static class Program
	{
		/// <summary>
		/// The main entry point for the application.
		/// </summary>
		[STAThread]
		private static void Main()
		{
			ProfileOptimization.SetProfileRoot(Path.Combine(Path.GetTempPath(), "Rectify11"));
			ProfileOptimization.StartProfile("Startup.Profile");
			if (Environment.OSVersion.Version.Build >= 10240)
			{
				Theme.InitTheme();
				if ((Environment.OSVersion.Version.Build >= 17763) && (Environment.OSVersion.Version.Build < 18362))
				{
					DarkMode.AllowDarkModeForApp(true);
				}
				else if (Environment.OSVersion.Version.Build >= 18362)
				{
					DarkMode.SetPreferredAppMode(DarkMode.PreferredAppMode.AllowDark);
				}
			}
			if (!Directory.Exists(Variables.r11Folder))
			{
				Directory.CreateDirectory(Variables.r11Folder);
			}

			if ((!File.Exists(Path.Combine(Variables.r11Folder, "Dark.msstyles"))) && (!File.Exists(Path.Combine(Variables.r11Folder, "light.msstyles"))))
			{
				File.WriteAllBytes(Path.Combine(Variables.r11Folder, "Dark.msstyles"), Properties.Resources.Dark);
				File.WriteAllBytes(Path.Combine(Variables.r11Folder, "light.msstyles"), Properties.Resources.light);
			}
			Theme.LoadTheme();
			Application.EnableVisualStyles();
			Application.SetCompatibleTextRenderingDefault(false);
			//Thread.CurrentThread.CurrentUICulture = CultureInfo.GetCultureInfo("ko");
			Thread.CurrentThread.CurrentUICulture = CultureInfo.CurrentUICulture;
			Application.Run(new frmWizard());
		}
	}
}

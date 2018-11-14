Feature('Profile Page - @smoke')

BeforeSuite(async (loginPage) => {
  await loginPage.deleteUser('syst_three')
  await loginPage.addUser('syst_three', '123456')
  await loginPage.createSession('syst_three', '123456', '/profile')
})

AfterSuite(async (I, loginPage) => {
  await I.clearCookie('accessToken')
  await loginPage.deleteUser('syst_three')
})

Before(async (loginPage) => {
})

After(async (loginPage) => {
})

Scenario('Change Personal Details', async (I, loginPage, profilePage) => {
  await profilePage.changePersonalDetails('First', 'Last')
})
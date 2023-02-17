import NavbarFunctions from '@/components/organisms/Navbar/model/NavbarFunctions'
import { Navbar } from '@/keys'
import { inject } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

export default function useNavbar(): NavbarFunctions | undefined {
  const navbar = inject(Navbar) as NavbarFunctions | undefined

  onBeforeRouteLeave(() => {
    navbar?.setGame()
    navbar?.setTutorialHandler()
  })

  return navbar
}

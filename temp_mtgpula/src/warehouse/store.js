
import { auth } from './auth'
import { ref } from "vue";
export const authenticated = ref(auth.getUser())
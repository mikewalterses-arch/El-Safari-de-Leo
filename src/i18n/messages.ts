/**
 * Diccionario de strings de la app en castellano y euskera.
 * Las claves son namespaced por área (`nav.`, `home.`, `newSighting.`, etc).
 *
 * Cuando una clave falte en `eu`, useT() cae a `es` automáticamente.
 *
 * TODO(post-fase-4): revisar las traducciones de euskera con un nativo.
 * Mientras tanto, son razonables pero pueden tener errores menores.
 */

export type Locale = 'es' | 'eu';

export const SUPPORTED_LOCALES: Locale[] = ['es', 'eu'];

export const LOCALE_NAMES: Record<Locale, string> = {
  es: 'Castellano',
  eu: 'Euskera',
};

type Messages = Record<string, string>;

const es: Messages = {
  // Navegación
  'nav.home': 'Inicio',
  'nav.map': 'Mapa',
  'nav.new': 'Nuevo',
  'nav.collection': 'Colección',
  'nav.diary': 'Diario',
  'nav.profile': 'Perfil',
  'common.back': 'Atrás',
  'common.loading': 'Cargando...',

  // Home
  'home.greeting': '¡Hola, Leo!',
  'home.subgreeting': '¿Qué animales has visto hoy?',
  'home.nearbyTitle': 'Animales cerca de ti',
  'home.nearbyLoading': 'Buscando qué hay por aquí...',
  'home.nearbyDenied': 'Activa la ubicación para ver qué animales hay cerca.',
  'home.nearbyError': 'No pude consultar ahora. Inténtalo más tarde.',
  'home.nearbyEmpty': 'No hay observaciones recientes registradas en esta zona.',

  // Mapa
  'map.title': 'Mapa',
  'map.empty': 'Cuando hagas tu primer avistamiento con ubicación aparecerá aquí.',
  'map.count.one': '1 avistamiento con ubicación.',
  'map.count.other': '{count} avistamientos con ubicación.',

  // Nuevo avistamiento
  'newSighting.takePhotoTitle': 'Hacer foto',
  'newSighting.takePhotoSubtitle': 'Al animal que quieres añadir al safari.',
  'newSighting.takePhoto': 'Hacer foto',
  'newSighting.galleryHint': 'o elegir de la galería',
  'newSighting.another': 'Otra',
  'newSighting.next': 'Sigue',
  'newSighting.identifyTitle': '¿Qué es?',
  'newSighting.identifySubtitle': 'Escribe el nombre y elige el correcto.',
  'newSighting.searchLabel': '¿Qué animal viste?',
  'newSighting.searchPlaceholder': 'Escribe el nombre...',
  'newSighting.searching': 'Buscando...',
  'newSighting.searchError': 'No se pudo buscar. ¿Hay internet?',
  'newSighting.confirmTitle': '¡Casi! ¿Algo más?',
  'newSighting.confirmSubtitle': 'Revisa los datos y guarda tu avistamiento.',
  'newSighting.animal': 'Animal',
  'newSighting.location': 'Lugar',
  'newSighting.noLocation': 'Sin ubicación',
  'newSighting.note': 'Tu nota (opcional)',
  'newSighting.notePlaceholder': 'Lo que quieras contar de este animal...',
  'newSighting.save': 'Guardar',
  'newSighting.saving': 'Guardando tu avistamiento...',
  'newSighting.saved': '¡Guardado!',

  // Colección (Pokédex)
  'collection.title': 'Tu colección',
  'collection.empty': 'Todavía no has descubierto ningún animal. ¡Hazle una foto al primero!',
  'collection.count.one': '1 animal descubierto',
  'collection.count.other': '{count} animales descubiertos',
  'collection.unclassified': 'Otros',

  // Diario
  'diary.title': 'Diario',
  'diary.empty': 'Aquí verás todas tus aventuras en orden. ¡Empieza haciendo un avistamiento!',
  'diary.count.one': 'Tu 1 aventura',
  'diary.count.other': 'Tus {count} aventuras',

  // Detalle de animal
  'animal.notFound': 'No encontré este animal.',
  'animal.sound': '¿Cómo suena?',
  'animal.soundPlaying': 'Sonando...',
  'animal.wikipedia': 'Saber más en Wikipedia',
  'animal.timesSeen.one': 'Lo has visto 1 vez',
  'animal.timesSeen.other': 'Lo has visto {count} veces',

  // Perfil
  'profile.title': 'Perfil',
  'profile.statsAvistamientos': 'Avistamientos',
  'profile.statsAnimales': 'Animales',
  'profile.statsLugares': 'Lugares',
  'profile.taxonomyTitle': 'Tus tipos de animales',
  'profile.taxonomyEmpty': 'Cuando hagas avistamientos, aquí verás un gráfico con los tipos de animales que has visto (mamíferos, aves, reptiles...).',
  'profile.languageTitle': 'Idioma',
};

const eu: Messages = {
  // Nabigazioa
  'nav.home': 'Hasiera',
  'nav.map': 'Mapa',
  'nav.new': 'Berria',
  'nav.collection': 'Bilduma',
  'nav.diary': 'Egunerokoa',
  'nav.profile': 'Profila',
  'common.back': 'Atzera',
  'common.loading': 'Kargatzen...',

  // Hasiera
  'home.greeting': 'Kaixo, Leo!',
  'home.subgreeting': 'Zer animalia ikusi dituzu gaur?',
  'home.nearbyTitle': 'Inguruko animaliak',
  'home.nearbyLoading': 'Hemen zer dagoen bilatzen...',
  'home.nearbyDenied': 'Kokapena gaitu inguruan zer animalia dauden ikusteko.',
  'home.nearbyError': 'Ezin izan dut kontsultatu. Saiatu beranduago.',
  'home.nearbyEmpty': 'Ez dago inguru honetan azken behaketarik.',

  // Mapa
  'map.title': 'Mapa',
  'map.empty': 'Kokapenarekin lehen behaketa egiten duzunean, hemen agertuko da.',
  'map.count.one': 'Behaketa 1 kokapenarekin.',
  'map.count.other': '{count} behaketa kokapenarekin.',

  // Behaketa berria
  'newSighting.takePhotoTitle': 'Argazkia atera',
  'newSighting.takePhotoSubtitle': 'Safarira gehitu nahi duzun animaliari.',
  'newSighting.takePhoto': 'Argazkia atera',
  'newSighting.galleryHint': 'edo galeriatik aukeratu',
  'newSighting.another': 'Beste bat',
  'newSighting.next': 'Jarraitu',
  'newSighting.identifyTitle': 'Zer da?',
  'newSighting.identifySubtitle': 'Idatzi izena eta aukeratu egokia.',
  'newSighting.searchLabel': 'Zer animalia ikusi duzu?',
  'newSighting.searchPlaceholder': 'Idatzi izena...',
  'newSighting.searching': 'Bilatzen...',
  'newSighting.searchError': 'Ezin izan da bilatu. Internet dago?',
  'newSighting.confirmTitle': 'Ia! Beste zerbait?',
  'newSighting.confirmSubtitle': 'Egiaztatu datuak eta gorde behaketa.',
  'newSighting.animal': 'Animalia',
  'newSighting.location': 'Lekua',
  'newSighting.noLocation': 'Kokapenik gabe',
  'newSighting.note': 'Zure oharra (aukerakoa)',
  'newSighting.notePlaceholder': 'Animalia honi buruz kontatu nahi duzuna...',
  'newSighting.save': 'Gorde',
  'newSighting.saving': 'Behaketa gordetzen...',
  'newSighting.saved': 'Gordeta!',

  // Bilduma
  'collection.title': 'Zure bilduma',
  'collection.empty': 'Oraindik ez duzu animaliarik aurkitu. Atera argazkia lehenengoari!',
  'collection.count.one': 'Animalia 1 aurkituta',
  'collection.count.other': '{count} animalia aurkituta',
  'collection.unclassified': 'Besteak',

  // Egunerokoa
  'diary.title': 'Egunerokoa',
  'diary.empty': 'Hemen abentura guztiak ordenan ikusiko dituzu. Hasi behaketa bat eginez!',
  'diary.count.one': 'Zure abentura 1',
  'diary.count.other': 'Zure {count} abenturak',

  // Animalia xehetasuna
  'animal.notFound': 'Ez dut aurkitu animalia hau.',
  'animal.sound': 'Nola entzuten da?',
  'animal.soundPlaying': 'Entzuten...',
  'animal.wikipedia': 'Gehiago jakin Wikipedian',
  'animal.timesSeen.one': 'Behin ikusi duzu',
  'animal.timesSeen.other': '{count} aldiz ikusi duzu',

  // Profila
  'profile.title': 'Profila',
  'profile.statsAvistamientos': 'Behaketak',
  'profile.statsAnimales': 'Animaliak',
  'profile.statsLugares': 'Lekuak',
  'profile.taxonomyTitle': 'Zure animalia motak',
  'profile.taxonomyEmpty': 'Behaketak egiten dituzunean, hemen ikusiko duzu zer animalia mota ikusi dituzun (ugaztunak, hegaztiak, narrastiak...).',
  'profile.languageTitle': 'Hizkuntza',
};

export const MESSAGES: Record<Locale, Messages> = { es, eu };

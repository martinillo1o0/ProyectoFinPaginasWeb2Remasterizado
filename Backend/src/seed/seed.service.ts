import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Genre } from '../genres/entities/genre.entity';
import { Song } from '../songs/entities/song.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
  ) {}

  async onModuleInit() {
    await this.runSeed();
  }

  async runSeed() {
    let admin = await this.userRepository.findOne({ where: { email: 'admin@martimusic.com' } });
    if (!admin) {
      admin = await this.userRepository.save(this.userRepository.create({
        email: 'admin@martimusic.com',
        password: bcrypt.hashSync('Admin123', 10),
        fullName: 'Administrador Marti Music',
        isActive: true,
        roles: ['admin'],
      }));
    }

    const normalUser = await this.userRepository.findOne({ where: { email: 'usuario@martimusic.com' } });
    if (!normalUser) {
      await this.userRepository.save(this.userRepository.create({
        email: 'usuario@martimusic.com',
        password: bcrypt.hashSync('Usuario123', 10),
        fullName: 'Usuario Marti Music',
        isActive: true,
        roles: ['user'],
      }));
    }

    const genreData = [
      { name: 'Pop', slug: 'pop', description: 'Melodías contemporáneas y pegajosas.' },
      { name: 'Rock', slug: 'rock', description: 'Guitarras, energía y actitud.' },
      { name: 'Hip-Hop', slug: 'hip-hop', description: 'Ritmo, rimas y producción urbana.' },
      { name: 'Electrónica', slug: 'electronica', description: 'Sintetizadores, beats y atmósferas digitales.' },
      { name: 'Regional Mexicano', slug: 'regional-mexicano', description: 'Sonidos inspirados en la tradición musical mexicana.' },
    ];

    const genres = new Map<string, Genre>();
    for (const data of genreData) {
      let genre = await this.genreRepository.findOne({ where: { slug: data.slug } });
      if (!genre) genre = await this.genreRepository.save(this.genreRepository.create(data));
      genres.set(data.slug, genre);
    }

    const songs = [
      { title: 'Luces de Medianoche', artist: 'Nora Vega', album: 'Ciudad de Cristal', slug: 'luces-de-medianoche', durationSeconds: 214, releaseYear: 2026, genre: 'pop', coverUrl: 'luces-medianoche.svg', tags: ['pop', 'nocturna', 'sintetizadores'], description: 'Pop luminoso sobre recorrer una ciudad que nunca duerme.' },
      { title: 'Mapa de Estrellas', artist: 'Leo Prisma', album: 'Órbita', slug: 'mapa-de-estrellas', durationSeconds: 198, releaseYear: 2025, genre: 'pop', coverUrl: 'mapa-estrellas.svg', tags: ['pop', 'romantica'], description: 'Una canción pop melódica inspirada en encontrar dirección entre recuerdos.' },
      { title: 'Kilómetro Cero', artist: 'Los Cobalto', album: 'Ruta 57', slug: 'kilometro-cero', durationSeconds: 241, releaseYear: 2024, genre: 'rock', coverUrl: 'kilometro-cero.svg', tags: ['rock', 'carretera', 'guitarras'], description: 'Rock de carretera con guitarras abiertas y un coro hecho para cantar en grupo.' },
      { title: 'Voltaje', artist: 'Río Eléctrico', album: 'Alta Tensión', slug: 'voltaje', durationSeconds: 226, releaseYear: 2026, genre: 'rock', coverUrl: 'voltaje.svg', tags: ['rock', 'energia'], description: 'Una descarga de rock moderno sobre volver a empezar con más fuerza.' },
      { title: 'Sin Filtro', artist: 'Mauro 24', album: 'Pulso', slug: 'sin-filtro', durationSeconds: 187, releaseYear: 2026, genre: 'hip-hop', coverUrl: 'sin-filtro.svg', tags: ['hip-hop', 'rap', 'urbano'], description: 'Hip-hop directo con barras sobre identidad, trabajo y ambición.' },
      { title: 'Distrito Norte', artist: 'Kira M', album: 'Concreto', slug: 'distrito-norte', durationSeconds: 203, releaseYear: 2025, genre: 'hip-hop', coverUrl: 'distrito-norte.svg', tags: ['hip-hop', 'ciudad'], description: 'Beat urbano con una narrativa de barrio y crecimiento personal.' },
      { title: 'Neón Lluvia', artist: 'Pulse Array', album: 'Afterglow', slug: 'neon-lluvia', durationSeconds: 252, releaseYear: 2026, genre: 'electronica', coverUrl: 'neon-lluvia.svg', tags: ['electronica', 'synthwave'], description: 'Electrónica atmosférica con bajos profundos y texturas de neón.' },
      { title: 'Frecuencia Azul', artist: 'Delta/9', album: 'Espectro', slug: 'frecuencia-azul', durationSeconds: 268, releaseYear: 2025, genre: 'electronica', coverUrl: 'frecuencia-azul.svg', tags: ['electronica', 'ambient'], description: 'Un viaje electrónico progresivo pensado para escuchar con audífonos.' },
      { title: 'Camino de Agave', artist: 'Sierra Clara', album: 'Horizonte', slug: 'camino-de-agave', durationSeconds: 231, releaseYear: 2025, genre: 'regional-mexicano', coverUrl: 'camino-agave.svg', tags: ['regional', 'mexico', 'acustica'], description: 'Regional mexicano contemporáneo con guitarras y una historia de regreso a casa.' },
      { title: 'Carta del Bajío', artist: 'Trío Encino', album: 'Raíces Nuevas', slug: 'carta-del-bajio', durationSeconds: 219, releaseYear: 2026, genre: 'regional-mexicano', coverUrl: 'carta-bajio.svg', tags: ['regional', 'bajio', 'tradicion'], description: 'Una pieza cálida inspirada en paisajes del Bajío y vínculos familiares.' },
      { title: 'Domingo en Marte', artist: 'Nora Vega', album: 'Ciudad de Cristal', slug: 'domingo-en-marte', durationSeconds: 205, releaseYear: 2026, genre: 'pop', coverUrl: 'domingo-marte.svg', tags: ['pop', 'espacial'], description: 'Pop ligero con una letra imaginativa sobre escaparse de la rutina.' },
      { title: 'Última Salida', artist: 'Los Cobalto', album: 'Ruta 57', slug: 'ultima-salida', durationSeconds: 244, releaseYear: 2024, genre: 'rock', coverUrl: 'ultima-salida.svg', tags: ['rock', 'alternativo'], description: 'Rock alternativo con dinámica ascendente y un final intenso.' },
      { title: "It's My Life", artist: 'Bon Jovi', album: 'Clásicos del Rock', slug: 'its-my-life', durationSeconds: 224, releaseYear: 2000, genre: 'rock', coverUrl: '/assets/images/canciones/Bon_JoviItsMyLife.jpg', tags: ['rock', 'clasicos'], description: 'Un himno de rock sobre vivir con decisión y aprovechar cada momento.' },
      { title: 'Living on a Prayer', artist: 'Bon Jovi', album: 'Clásicos del Rock', slug: 'living-on-a-prayer', durationSeconds: 249, releaseYear: 1986, genre: 'rock', coverUrl: '/assets/images/canciones/PortadaBonJoviLivingInPlayer.jpg', tags: ['rock', 'clasicos'], description: 'Rock melódico sobre esperanza, esfuerzo y seguir adelante juntos.' },
      { title: "Don't Stop Me Now", artist: 'Queen', album: 'Clásicos del Rock', slug: 'dont-stop-me-now', durationSeconds: 209, releaseYear: 1978, genre: 'rock', coverUrl: '/assets/images/canciones/QueenPortada.jpg', tags: ['rock', 'clasicos'], description: 'Una celebración de energía, libertad y alegría sin límites.' },
      { title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', slug: 'bohemian-rhapsody', durationSeconds: 355, releaseYear: 1975, genre: 'rock', coverUrl: '/assets/images/canciones/PortadaQueen2.jpg', tags: ['rock', 'clasicos'], description: 'Una pieza teatral que mezcla rock, drama y cambios inolvidables.' },
      { title: 'Billie Jean', artist: 'Michael Jackson', album: 'Thriller', slug: 'billie-jean', durationSeconds: 294, releaseYear: 1982, genre: 'pop', coverUrl: '/assets/images/canciones/MichaelJacksonPortada.png', tags: ['pop', 'clasicos'], description: 'Pop bailable con una línea de bajo icónica y un misterio por resolver.' },
      { title: 'Thriller', artist: 'Michael Jackson', album: 'Thriller', slug: 'thriller', durationSeconds: 358, releaseYear: 1982, genre: 'pop', coverUrl: '/assets/images/canciones/MichaelJacksonPortada2.jpg', tags: ['pop', 'clasicos'], description: 'Un clásico pop de atmósfera oscura, ritmo preciso y gran espectáculo.' },
      { title: 'Danza Kuduro', artist: 'Don Omar', album: 'Meet the Orphans', slug: 'danza-kuduro', durationSeconds: 200, releaseYear: 2010, genre: 'pop', coverUrl: '/assets/images/canciones/DonOmarPortada.jpg', tags: ['pop', 'latina'], description: 'Ritmo latino festivo pensado para llenar la pista de baile.' },
      { title: 'Taboo', artist: 'Don Omar', album: 'Meet the Orphans', slug: 'taboo', durationSeconds: 253, releaseYear: 2011, genre: 'pop', coverUrl: '/assets/images/canciones/DonOmarPortada2.jpg', tags: ['pop', 'latina'], description: 'Una mezcla intensa de pop latino, percusión y energía tropical.' },
      { title: 'Give Me Everything', artist: 'Pitbull', album: 'Planet Pit', slug: 'give-me-everything', durationSeconds: 258, releaseYear: 2011, genre: 'electronica', coverUrl: '/assets/images/canciones/PitbullPortada.jpg', tags: ['electronica', 'dance'], description: 'Dance pop expansivo para cantar, bailar y disfrutar la noche.' },
      { title: 'Rain Over Me', artist: 'Pitbull', album: 'Planet Pit', slug: 'rain-over-me', durationSeconds: 225, releaseYear: 2011, genre: 'electronica', coverUrl: '/assets/images/canciones/PitbulPortada2.jpg', tags: ['electronica', 'dance'], description: 'Producción electrónica y actitud positiva con pulso de club.' },
      { title: 'Cielito Lindo', artist: 'Pedro Infante', album: 'México de Siempre', slug: 'cielito-lindo', durationSeconds: 181, releaseYear: 1950, genre: 'regional-mexicano', coverUrl: '/assets/images/canciones/PedroInfatePortada.jpg', tags: ['regional', 'mexico'], description: 'Una interpretación entrañable de la tradición musical mexicana.' },
      { title: 'El Rey', artist: 'José Alfredo Jiménez', album: 'Rancheras Inmortales', slug: 'el-rey', durationSeconds: 156, releaseYear: 1971, genre: 'regional-mexicano', coverUrl: '/assets/images/canciones/JoseAlfredoJimenezPortada.jpg', tags: ['regional', 'ranchera'], description: 'Canción ranchera de orgullo, desamor y una voz que permanece.' },
      { title: 'Las Mañanitas', artist: 'Chabelo', album: 'Canciones de Siempre', slug: 'las-mananitas', durationSeconds: 173, releaseYear: 1978, genre: 'regional-mexicano', coverUrl: '/assets/images/canciones/ChabeloPortada.jpg', tags: ['regional', 'tradicion'], description: 'Un recuerdo popular y familiar de la música mexicana.' },
      { title: 'Himno de Fiesta', artist: 'Marshmello', album: 'Joytime', slug: 'himno-de-fiesta', durationSeconds: 214, releaseYear: 2016, genre: 'electronica', coverUrl: '/assets/images/canciones/MarchmeloPortada.jpg', tags: ['electronica', 'dance'], description: 'Electrónica accesible con una melodía luminosa y contagiosa.' },
      { title: 'Alone', artist: 'Marshmello', album: 'Joytime', slug: 'alone', durationSeconds: 256, releaseYear: 2016, genre: 'electronica', coverUrl: '/assets/images/canciones/Marchmeloportada2.jpg', tags: ['electronica', 'ambient'], description: 'Un beat emocional que combina sintetizadores brillantes y nostalgia.' },
    ];

    for (const data of songs) {
      const exists = await this.songRepository.findOne({ where: { slug: data.slug } });
      if (!exists) {
        const genre = genres.get(data.genre);
        if (!genre) continue;
        await this.songRepository.save(this.songRepository.create({
          title: data.title,
          artist: data.artist,
          album: data.album,
          description: data.description,
          slug: data.slug,
          durationSeconds: data.durationSeconds,
          releaseYear: data.releaseYear,
          coverUrl: data.coverUrl,
          tags: data.tags,
          genre,
          user: admin,
        }));
      }
    }

    return { message: 'Seed musical ejecutado correctamente' };
  }
}

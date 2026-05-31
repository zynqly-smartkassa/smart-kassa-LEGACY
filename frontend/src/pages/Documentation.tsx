import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Github,
  ExternalLink,
  Database,
  Shield,
  Cloud,
  Smartphone,
  Code,
  Layers,
  FileText,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const Documentation = () => {
  return (
    <section className="flex flex-col w-full min-h-screen">
      <div className="flex flex-col gap-1 pb-4">
        <h2 className="page-title">Dokumentation</h2>
        <p className="subheader">
          Technische Dokumentation und Entwickler-Ressourcen
        </p>
      </div>

      <div className="flex flex-col gap-6 mt-4">
        {/* Übersicht */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-violet-600" />
              Was ist Smart-Kassa?
            </CardTitle>
            <CardDescription>
              Ein modernes Kassensystem für Taxiunternehmen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Zynqlys Smart-Kassa ist ein vollständiges Register-System, das
              speziell für Taxi-Unternehmen entwickelt wurde. Das System bietet
              GPS-Tracking, automatische Rechnungsgenerierung und umfassende
              Analytics.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-violet-50 dark:bg-violet-950">
                <Smartphone className="w-5 h-5 text-violet-600 dark:text-violet-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Cross-Platform</p>
                  <p className="text-xs text-muted-foreground">
                    Web, iOS & Android
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                <Database className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">PostgreSQL</p>
                  <p className="text-xs text-muted-foreground">
                    Sichere Datenspeicherung
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">JWT Auth</p>
                  <p className="text-xs text-muted-foreground">
                    Sicheres Login-System
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
                <Cloud className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Cloud Storage</p>
                  <p className="text-xs text-muted-foreground">
                    Railway S3 Buckets
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-violet-600" />
              Tech Stack
            </CardTitle>
            <CardDescription>
              Technologien und Frameworks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="frontend">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Frontend
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <div className="p-2 bg-sidebar rounded-md">React + TypeScript</div>
                    <div className="p-2 bg-sidebar rounded-md">TailwindCSS</div>
                    <div className="p-2 bg-sidebar rounded-md">Redux</div>
                    <div className="p-2 bg-sidebar rounded-md">Shadcn/ui</div>
                    <div className="p-2 bg-sidebar rounded-md">Framer Motion</div>
                    <div className="p-2 bg-sidebar rounded-md">Leaflet Maps</div>
                    <div className="p-2 bg-sidebar rounded-md">Capacitor</div>
                    <div className="p-2 bg-sidebar rounded-md">Vite</div>
                    <div className="p-2 bg-sidebar rounded-md">Vitest</div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="backend">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Backend
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <div className="p-2 bg-sidebar rounded-md">Node.js</div>
                    <div className="p-2 bg-sidebar rounded-md">Express.js</div>
                    <div className="p-2 bg-sidebar rounded-md">PostgreSQL</div>
                    <div className="p-2 bg-sidebar rounded-md">JWT</div>
                    <div className="p-2 bg-sidebar rounded-md">Argon2</div>
                    <div className="p-2 bg-sidebar rounded-md">AWS SDK</div>
                    <div className="p-2 bg-sidebar rounded-md">Puppeteer</div>
                    <div className="p-2 bg-sidebar rounded-md">Helmet</div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="deployment">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4" />
                    Deployment
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-sidebar rounded-md">Frontend: Vercel</div>
                    <div className="p-2 bg-sidebar rounded-md">Backend: Railway</div>
                    <div className="p-2 bg-sidebar rounded-md">Database: Railway PostgreSQL</div>
                    <div className="p-2 bg-sidebar rounded-md">Storage: Railway S3</div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Architektur */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-violet-600" />
              System-Architektur
            </CardTitle>
            <CardDescription>
              Übersicht der System-Komponenten
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Die Anwendung folgt einer modernen Client-Server-Architektur mit
              klarer Trennung zwischen Frontend, Backend und Datenschicht.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <a
                  href="https://www.figma.com/design/BPqmonzixS6mlzLSKTUJoK/Zynqly---Smart-Kassa-Project"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Architektur-Diagramm (Figma)
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API Dokumentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-600" />
              API Dokumentation
            </CardTitle>
            <CardDescription>
              RESTful API Endpoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="auth">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Authentication Endpoints
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-sidebar">
                      <code className="text-xs font-mono bg-violet-100 dark:bg-violet-950 px-2 py-1 rounded">
                        POST /register
                      </code>
                      <p className="text-sm text-muted-foreground flex-1">
                        Benutzer registrieren
                      </p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-sidebar">
                      <code className="text-xs font-mono bg-violet-100 dark:bg-violet-950 px-2 py-1 rounded">
                        POST /login
                      </code>
                      <p className="text-sm text-muted-foreground flex-1">
                        Benutzer anmelden
                      </p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-sidebar">
                      <code className="text-xs font-mono bg-violet-100 dark:bg-violet-950 px-2 py-1 rounded">
                        POST /verify
                      </code>
                      <p className="text-sm text-muted-foreground flex-1">
                        Token verifizieren
                      </p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-sidebar">
                      <code className="text-xs font-mono bg-violet-100 dark:bg-violet-950 px-2 py-1 rounded">
                        POST /refresh
                      </code>
                      <p className="text-sm text-muted-foreground flex-1">
                        Access Token erneuern
                      </p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-sidebar">
                      <code className="text-xs font-mono bg-violet-100 dark:bg-violet-950 px-2 py-1 rounded">
                        POST /logout
                      </code>
                      <p className="text-sm text-muted-foreground flex-1">
                        Benutzer abmelden
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="rides">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Ride Endpoints
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-sidebar">
                      <code className="text-xs font-mono bg-blue-100 dark:bg-blue-950 px-2 py-1 rounded">
                        POST /ride
                      </code>
                      <p className="text-sm text-muted-foreground flex-1">
                        Neue Fahrt erstellen
                      </p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-sidebar">
                      <code className="text-xs font-mono bg-blue-100 dark:bg-blue-950 px-2 py-1 rounded">
                        GET /ride/:id
                      </code>
                      <p className="text-sm text-muted-foreground flex-1">
                        Einzelne Fahrt abrufen
                      </p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-sidebar">
                      <code className="text-xs font-mono bg-blue-100 dark:bg-blue-950 px-2 py-1 rounded">
                        GET /all-rides
                      </code>
                      <p className="text-sm text-muted-foreground flex-1">
                        Alle Fahrten abrufen
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="invoices">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Invoice Endpoints
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-sidebar">
                      <code className="text-xs font-mono bg-green-100 dark:bg-green-950 px-2 py-1 rounded">
                        POST /invoice
                      </code>
                      <p className="text-sm text-muted-foreground flex-1">
                        Rechnung erstellen
                      </p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-sidebar">
                      <code className="text-xs font-mono bg-green-100 dark:bg-green-950 px-2 py-1 rounded">
                        GET /storage/invoices
                      </code>
                      <p className="text-sm text-muted-foreground flex-1">
                        Alle Rechnungen abrufen
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Externe Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-violet-600" />
              Externe Ressourcen
            </CardTitle>
            <CardDescription>
              Weiterführende Links und Dokumentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button asChild variant="outline">
                <a
                  href="https://github.com/zynqly-smartkassa/smart-kassa"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub Repository
                </a>
              </Button>
              <Button asChild variant="outline">
                <a
                  href="https://smart-kassa.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Web App
                </a>
              </Button>
              <Button asChild variant="outline">
                <a
                  href="https://github.com/zynqly-smartkassa/smart-kassa/blob/main/AUTH.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Auth Dokumentation
                </a>
              </Button>
              <Button asChild variant="outline">
                <a
                  href="https://www.figma.com/design/BPqmonzixS6mlzLSKTUJoK/Zynqly---Smart-Kassa-Project"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Layers className="w-4 h-4 mr-2" />
                  Figma Design
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Team */}
        <Card>
          <CardHeader>
            <CardTitle>Team</CardTitle>
            <CardDescription>
              Entwickelt von Studenten der FH Joanneum
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-sidebar">
                <p className="font-semibold text-sm">Casper Zielinski</p>
                <p className="text-xs text-muted-foreground">Fullstack Developer</p>
              </div>
              <div className="p-3 rounded-lg bg-sidebar">
                <p className="font-semibold text-sm">Mario Shenouda</p>
                <p className="text-xs text-muted-foreground">CEO & Backend Developer</p>
              </div>
              <div className="p-3 rounded-lg bg-sidebar">
                <p className="font-semibold text-sm">Markus Rossmann</p>
                <p className="text-xs text-muted-foreground">Backend & DevOps</p>
              </div>
              <div className="p-3 rounded-lg bg-sidebar">
                <p className="font-semibold text-sm">Umejr Džinović</p>
                <p className="text-xs text-muted-foreground">Frontend & Design</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Documentation;

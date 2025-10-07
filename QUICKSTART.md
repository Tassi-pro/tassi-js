# Guide de démarrage rapide - Tassi JavaScript/TypeScript SDK

Ce guide vous accompagne pas à pas pour installer et utiliser le SDK Tassi.

## Étape 1 : Créer votre projet

```bash
# Créer un nouveau dossier pour votre projet
mkdir mon-projet-tassi
cd mon-projet-tassi
```

## Étape 2 : Initialiser le projet Node.js

```bash
# Initialiser npm
npm init -y

# OU créer un package.json manuel
```

Créez un fichier `package.json` :

```json
{
  "name": "mon-projet-tassi",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  }
}
```

## Étape 3 : Installer Tassi

### Option A : Depuis npm (quand publié)

```bash
npm install @tassi/sdk
```

### Option B : Depuis GitHub (développement)

```bash
# Ajouter le repository GitHub
npm install git+https://github.com/Tassi-pro/tassi-js.git

# OU avec une version spécifique
npm install git+https://github.com/Tassi-pro/tassi-js.git#v1.0.0
```

**Sortie attendue :**
```
added 2 packages, and audited 3 packages in 2s
found 0 vulnerabilities
```

## Étape 4 : Vérifier l'installation

Créez un fichier `test-install.js` :

```javascript
import { Tassi } from '@tassi/sdk';

console.log('Tassi SDK version:', Tassi.VERSION);
```

Exécutez :

```bash
node test-install.js
```

**Sortie attendue :**
```
Tassi SDK version: 1.0.0
```

## Étape 5 : Créer votre premier script

### JavaScript (ES Modules)

Créez un fichier `index.js` :

```javascript
import { Tassi, Package } from '@tassi/sdk';

// Configuration
Tassi.setApiKey('votre_cle_api_ici');
Tassi.setEnvironment('sandbox');

// Test de connexion
async function main() {
  try {
    // Récupérer la liste des packages
    const result = await Package.all();

    console.log('Connexion réussie à l\'API Tassi!');
    console.log('SDK Version:', Tassi.VERSION);
    console.log('Environnement:', Tassi.getEnvironment());

    if (result.packages) {
      console.log('Nombre de packages:', result.packages.length);
    } else {
      console.log('Aucun package trouvé');
    }
  } catch (error) {
    console.error('Erreur de connexion:', error.message);
  }
}

main();
```

### TypeScript

Créez un fichier `index.ts` :

```typescript
import { Tassi, Package } from '@tassi/sdk';

// Configuration
Tassi.setApiKey('votre_cle_api_ici');
Tassi.setEnvironment('sandbox');

// Test de connexion
async function main(): Promise<void> {
  try {
    const result = await Package.all();

    console.log('Connexion réussie à l\'API Tassi!');
    console.log('SDK Version:', Tassi.VERSION);
    console.log('Environnement:', Tassi.getEnvironment());

    if (result.packages) {
      console.log('Nombre de packages:', result.packages.length);
    }
  } catch (error) {
    console.error('Erreur:', (error as Error).message);
  }
}

main();
```

Pour TypeScript, installez les dépendances :

```bash
npm install -D typescript ts-node @types/node
npx tsc --init
```

Exécutez :

```bash
npx ts-node index.ts
```

## Étape 6 : Configurer vos credentials

### Option A : Directement dans le code (pour tester)

```javascript
Tassi.setApiKey('sk_test_votre_cle_ici');
```

### Option B : Variables d'environnement (recommandé)

**1. Installer dotenv :**
```bash
npm install dotenv
```

**2. Créer un fichier `.env` :**
```bash
TASSI_API_KEY=sk_test_votre_cle_ici
TASSI_ENVIRONMENT=sandbox
```

**3. Ajouter `.env` au `.gitignore` :**
```bash
echo ".env" >> .gitignore
```

**4. Utiliser dans votre code :**
```javascript
import 'dotenv/config';
import { Tassi } from '@tassi/sdk';

Tassi.setApiKey(process.env.TASSI_API_KEY);
Tassi.setEnvironment(process.env.TASSI_ENVIRONMENT);
```

## Étape 7 : Exécuter votre script

```bash
node index.js
# OU pour TypeScript
npx ts-node index.ts
```

**Sortie attendue :**
```
Connexion réussie à l'API Tassi!
SDK Version: 1.0.0
Environnement: sandbox
Nombre de packages: 5
```

## Exemples d'utilisation

### Exemple 1 : Lister les packages

```javascript
import { Tassi, Package } from '@tassi/sdk';

Tassi.setApiKey('votre_cle');

async function listPackages() {
  const result = await Package.all();

  for (const pkg of result.packages) {
    console.log(`Package ${pkg.id}:`);
    console.log(`  - Tracking: ${pkg.tracking_number}`);
    console.log(`  - Status: ${pkg.status}`);
    console.log(`  - Description: ${pkg.description}`);
    console.log();
  }
}

listPackages();
```

### Exemple 2 : Créer une expédition

```javascript
import { Tassi, Shipment } from '@tassi/sdk';

Tassi.setApiKey('votre_cle');

async function createShipment() {
  const shipmentData = {
    marketplace_id: '1',
    customer: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      address: '123 Main St',
      city: 'Cotonou',
      country_code: 'BJ'
    },
    package: {
      description: 'Test package',
      weight: 2.5,
      dimensions: '20x15x10',
      declared_value: '50',
      currency: 'XOF'
    },
    route: {
      origin: 'Cotonou',
      destination: 'Porto-Novo'
    }
  };

  try {
    const shipment = await Shipment.create(shipmentData);
    console.log('Expédition créée:', shipment.id);
    console.log('Status:', shipment.status);
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

createShipment();
```

### Exemple 3 : Suivre un package

```javascript
import { Tassi, Package } from '@tassi/sdk';

Tassi.setApiKey('votre_cle');

async function trackPackage() {
  // Récupérer un package
  const pkg = await Package.retrieve(4);
  console.log('Package:', pkg.tracking_number);

  // Suivre le package
  const tracking = await pkg.track();
  console.log('Informations de suivi récupérées');
}

trackPackage();
```

### Exemple 4 : Gérer une marketplace

```javascript
import { Tassi, Marketplace } from '@tassi/sdk';

Tassi.setApiKey('votre_cle');

async function manageMarketplace() {
  // Récupérer une marketplace
  const marketplace = await Marketplace.retrieve(1);
  console.log('Marketplace:', marketplace.name);
  console.log('Active:', marketplace.is_active);

  // Historique du wallet
  const history = await marketplace.getWalletHistory();
  console.log('Mouvements:', history.wallet_movements.length);
}

manageMarketplace();
```

## Utilisation avec CDN (navigateur)

Créez un fichier `index.html` :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Tassi SDK Test</title>
</head>
<body>
  <h1>Tassi SDK Test</h1>
  <div id="result"></div>

  <script src="https://unpkg.com/@tassi/sdk@latest/dist/index.js"></script>
  <script>
    const { Tassi, Package } = TassiSDK;

    Tassi.setApiKey('votre_cle_api');
    Tassi.setEnvironment('sandbox');

    async function loadPackages() {
      try {
        const result = await Package.all();
        document.getElementById('result').innerHTML =
          `Packages trouvés: ${result.packages.length}`;
      } catch (error) {
        document.getElementById('result').innerHTML =
          `Erreur: ${error.message}`;
      }
    }

    loadPackages();
  </script>
</body>
</html>
```

## Structure recommandée du projet

### Pour Node.js

```
mon-projet-tassi/
├── node_modules/           # Dépendances
├── .env                    # Variables d'environnement (ne pas committer)
├── .gitignore             # Fichiers à ignorer
├── package.json           # Configuration npm
├── config.js              # Configuration centralisée
└── index.js               # Votre application
```

### Pour TypeScript

```
mon-projet-tassi/
├── node_modules/
├── src/
│   ├── config.ts
│   └── index.ts
├── dist/                  # Fichiers compilés
├── .env
├── .gitignore
├── package.json
└── tsconfig.json
```

### package.json recommandé

```json
{
  "name": "mon-projet-tassi",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "@tassi/sdk": "^1.0.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

### .gitignore

```
node_modules/
.env
*.log
dist/
.DS_Store
```

### config.js

```javascript
import 'dotenv/config';
import { Tassi } from '@tassi/sdk';

// Configuration Tassi
Tassi.setApiKey(process.env.TASSI_API_KEY);
Tassi.setEnvironment(process.env.TASSI_ENVIRONMENT || 'sandbox');

export { Tassi };
```

### index.js

```javascript
import './config.js';
import { Package, Shipment } from '@tassi/sdk';

// Votre code ici
async function main() {
  const packages = await Package.all();
  console.log('Packages:', packages.packages.length);
}

main();
```

## Gestion des erreurs

```javascript
import { Tassi, Package } from '@tassi/sdk';
import {
  TassiError,
  InvalidRequestError,
  ApiConnectionError,
  NotFoundError
} from '@tassi/sdk';

Tassi.setApiKey('votre_cle');

async function safeRetrieve() {
  try {
    const pkg = await Package.retrieve(999999);
  } catch (error) {
    if (error instanceof NotFoundError) {
      console.error('Package non trouvé');
    } else if (error instanceof ApiConnectionError) {
      console.error(`Erreur API (${error.httpStatus}):`, error.message);
    } else if (error instanceof InvalidRequestError) {
      console.error('Paramètres invalides:', error.message);
    } else if (error instanceof TassiError) {
      console.error('Erreur Tassi:', error.message);
    }
  }
}

safeRetrieve();
```

## Prochaines étapes

1. **Lire la documentation complète** : [README.md](README.md)
2. **Explorer les exemples** : Voir les exemples dans le README
3. **Tester avec l'API** : Utiliser le fichier `test_real_api.js`
4. **Rejoindre la communauté** : [GitHub Issues](https://github.com/Tassi-pro/tassi-js/issues)

## Commandes utiles

```bash
# Installer les dépendances
npm install

# Mettre à jour Tassi
npm update @tassi/sdk

# Lancer en mode développement
npm run dev

# Vérifier la version installée
npm list @tassi/sdk
```

## Dépannage

### Erreur : Cannot find module '@tassi/sdk'

```bash
# Vérifier l'installation
npm list @tassi/sdk

# Réinstaller
npm install @tassi/sdk --force
```

### Erreur : Unexpected token 'export'

Vous utilisez probablement CommonJS. Ajoutez dans `package.json` :

```json
{
  "type": "module"
}
```

Ou utilisez la syntaxe CommonJS :

```javascript
const { Tassi } = require('@tassi/sdk');
```

### Erreur d'authentification

Vérifiez votre clé API :

```javascript
console.log('API Key:', Tassi.getApiKey());
console.log('Environment:', Tassi.getEnvironment());
```

## Besoin d'aide ?

- **Documentation** : [README.md](README.md)
- **Issues** : [GitHub Issues](https://github.com/Tassi-pro/tassi-js/issues)

---

Vous êtes maintenant prêt à utiliser le SDK Tassi JavaScript ! 🚀
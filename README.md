📖 Book Note RecordA sophisticated, full-stack personal library manager that blends digital convenience with a classic "analog" notebook aesthetic. This application allows users to curate a collection of their favorite books, complete with personal reflections, ratings, and a unique visual style.🎨 The "Notebook" ExperienceUnlike standard database apps, this project focuses on a tactile user experience:Scrapbook Visuals: Book covers feature a 5px white border and a slight tilt to mimic being "taped" onto a page.Ruled Paper Layout: Notes are displayed on a dynamic, linear-gradient background that looks like college-ruled paper.Red Margin Line: A classic notebook margin line keeps the layout organized and authentic.Handwritten Feel: Carefully selected typography (Lato and Roboto) ensures high readability with a personal touch.🚀 Core Features🛠️ Full CRUD CapabilityCreate: Add books via ISBN. The app handles the fetching of covers and details.Read: Browse your collection in a beautifully formatted list that adapts to your device.Update: Edit your reflections and thoughts on any book in real-time.Delete: A safety-locked delete mechanism prevents accidental removals—requires a focused "confirmation" state.📱 Responsive DesignBuilt with a Mobile-First strategy:Mobile: Items stack vertically for easy scrolling on small screens.Desktop: Content expands into a side-by-side horizontal "notebook" view once the screen width exceeds 768px.🔍 Discovery & OrganizationLive Search: Find specific books in your library instantly via the search bar.Dynamic Sorting: Organize your collection by:Highest/Lowest RatingNewest/Oldest AdditionsAlphabetical (Title/Author)🛠️ Tech StackLayerTechnologyFrontendEJS, CSS3 (Custom Flexbox Grid)BackendNode.js, Express.jsDatabasePostgreSQLIntegrationOpen Library API (Covers & Metadata)📦 Installation & SetupClone the RepoBashgit clone https://github.com/FranciscoAguero247/Book-note-record.git
cd Book-note-record
Install DependenciesBashnpm install
Database ConfigurationCreate a PostgreSQL database and run the following schema:SQLCREATE TABLE books (
  id SERIAL PRIMARY KEY,
  isbn VARCHAR(20) UNIQUE NOT NULL,
  book_title TEXT,
  book_author TEXT,
  book_note TEXT,
  book_rating INTEGER,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Environment VariablesCreate a .env file in the root directory:Code snippetPORT=3000
DATABASE_URL=postgres://your_user:your_password@localhost:5432/your_db_name
Run LocallyBashnode index.js
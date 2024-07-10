import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filepath = searchParams.get('filepath');

    if (!filepath) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 });
    }

    const filePath = join(process.cwd(), filepath);

    // Verifica se o arquivo existe
    try {
      await fs.access(filePath);
    } catch (accessError) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Lê o conteúdo do arquivo
    const content = await fs.readFile(filePath, 'utf-8');

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { filename, content } = await request.json();

    if (!filename || !content) {
      return NextResponse.json({ error: 'Filename and content are required' }, { status: 400 });
    }

    const baseDirApp = join(process.cwd(), 'app', 'dashboard', filename);
    const baseDirLib = join(process.cwd(), 'app', 'lib', filename);
    const baseDirUI = join(process.cwd(), 'app', 'ui', filename);

    const pathsToCreateApp = [
      join(baseDirApp, 'page.tsx'),
      join(baseDirApp, 'error.tsx'),
      join(baseDirApp, 'create', 'page.tsx'),
      join(baseDirApp, '[id]', 'edit', 'page.tsx')
    ];

    const pathsToCreateLib = [
      join(baseDirLib, 'actions.ts'),
      join(baseDirLib, 'data.ts'),
      join(baseDirLib, 'definitions.ts')
    ];

    const pathsToCreateUI = [
      join(baseDirUI, 'buttons.tsx'),
      join(baseDirUI, 'create-form.tsx'),
      join(baseDirUI, 'edit-form.tsx'),
      join(baseDirUI, 'skeletons.tsx'),
      join(baseDirUI, 'status.tsx'),
      join(baseDirUI, 'table.tsx')
    ];

    const pathsToCreate = [...pathsToCreateApp, ...pathsToCreateLib, ...pathsToCreateUI];

    // Check if any of the files already exist
    for (const filePath of pathsToCreate) {
      try {
        await fs.access(filePath);
        return NextResponse.json({ message: `File ${filePath} already exists` }, { status: 400 });
      } catch (accessError) {
        // File does not exist, continue
      }
    }

    // Create directories and files if they do not exist
    for (const filePath of pathsToCreate) {
      const dirPath = dirname(filePath);
      await fs.mkdir(dirPath, { recursive: true });
      await fs.writeFile(filePath, content, 'utf-8');
    }

    return NextResponse.json({ message: 'Files created successfully' });
  } catch (error) {
    console.error('Error creating files:', error);
    return NextResponse.json({ error: 'Failed to create files' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { filepath, content } = await request.json();

    if (!filepath || !content) {
      return NextResponse.json({ error: 'Filepath and content are required' }, { status: 400 });
    }

    const fullPath = join(process.cwd(), 'app', filepath);

    // Check if the file exists
    try {
      await fs.access(fullPath);
    } catch (accessError) {
      return NextResponse.json({ message: `File ${fullPath} does not exist` }, { status: 400 });
    }

    // Update the file with the new content
    await fs.writeFile(fullPath, content, 'utf-8');

    return NextResponse.json({ message: 'File updated successfully' });
  } catch (error) {
    console.error('Error updating file:', error);
    return NextResponse.json({ error: 'Failed to update file' }, { status: 500 });
  }
}

async function deleteDirectoryRecursive(directoryPath: string) {
  try {
    const files = await fs.readdir(directoryPath);
    for (const file of files) {
      const filePath = join(directoryPath, file);
      const stat = await fs.lstat(filePath);

      if (stat.isDirectory()) {
        await deleteDirectoryRecursive(filePath);
      } else {
        await fs.unlink(filePath);
      }
    }
    await fs.rmdir(directoryPath);
  } catch (error) {
    console.error(`Error deleting directory: ${directoryPath}`, error);
    throw error;
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const filename = url.searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const baseDirApp = join(process.cwd(), 'app', 'dashboard', filename);
    const baseDirLib = join(process.cwd(), 'app', 'lib', filename);
    const baseDirUI = join(process.cwd(), 'app', 'ui', filename);

    await deleteDirectoryRecursive(baseDirApp);
    await deleteDirectoryRecursive(baseDirLib);
    await deleteDirectoryRecursive(baseDirUI);

    return NextResponse.json({ message: 'Files deleted successfully' });
  } catch (error) {
    console.error('Error deleting files:', error);
    return NextResponse.json({ error: 'Failed to delete files' }, { status: 500 });
  }
}

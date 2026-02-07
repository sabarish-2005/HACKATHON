/* Backend API Server */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend server is running',
    timestamp: new Date().toISOString(),
  });
});

// Database connection check
app.get('/api/db-status', async (req, res) => {
  try {
    const { count, error } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Database connection failed',
        error: error.message,
      });
    }

    res.json({
      status: 'connected',
      message: 'Database connection successful',
      tables: {
        registrations: count || 0,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: err.message,
    });
  }
});

// Get all registrations
app.get('/api/registrations', async (req, res) => {
  try {
    const { search, dept } = req.query;
    let query = supabase.from('registrations').select('*');

    if (search) {
      query = query.or(
        `team_name.ilike.%${search}%,leader_name.ilike.%${search}%`
      );
    }

    if (dept && dept !== 'All') {
      query = query.eq('leader_dept', dept);
    }

    const { data, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch registrations',
      error: err.message,
    });
  }
});

// Create registration
app.post('/api/registrations', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create registration',
      error: err.message,
    });
  }
});

// Update registration
app.put('/api/registrations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('registrations')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update registration',
      error: err.message,
    });
  }
});

// Delete registration
app.delete('/api/registrations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Registration deleted successfully' });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete registration',
      error: err.message,
    });
  }
});

// Get registration statistics
app.get('/api/statistics', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('status, leader_dept');

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      pending: data?.filter((r) => r.status === 'pending').length || 0,
      selected: data?.filter((r) => r.status === 'selected').length || 0,
      rejected: data?.filter((r) => r.status === 'rejected').length || 0,
      byDept: {},
    };

    data?.forEach((registration) => {
      const dept = registration.leader_dept;
      stats.byDept[dept] = (stats.byDept[dept] || 0) + 1;
    });

    res.json(stats);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch statistics',
      error: err.message,
    });
  }
});

// Events endpoints
app.get('/api/events', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch events',
      error: err.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    path: req.path,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Backend API Server running on http://localhost:${PORT}`);
  console.log(`✓ Supabase Project: ${supabaseUrl}`);
  console.log('\n📚 Available endpoints:');
  console.log(`  GET  http://localhost:${PORT}/api/health`);
  console.log(`  GET  http://localhost:${PORT}/api/db-status`);
  console.log(`  GET  http://localhost:${PORT}/api/registrations`);
  console.log(`  POST http://localhost:${PORT}/api/registrations`);
  console.log(`  PUT  http://localhost:${PORT}/api/registrations/:id`);
  console.log(`  DELETE http://localhost:${PORT}/api/registrations/:id`);
  console.log(`  GET  http://localhost:${PORT}/api/statistics`);
  console.log(`  GET  http://localhost:${PORT}/api/events\n`);
});
